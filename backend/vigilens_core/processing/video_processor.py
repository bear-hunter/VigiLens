# backend/vigilens_core/processing/video_processor.py
import os
import cv2
import time
from datetime import datetime
from ..database.models import db, Incident
from .pose_estimator import PoseEstimator
from .anomaly_detector import AnomalyDetector

# --- Initialize AI Models ---
# These are loaded once when the application starts.
try:
    pose_estimator = PoseEstimator()
    anomaly_detector = AnomalyDetector()
except FileNotFoundError as e:
    print(f"CRITICAL ERROR: {e}")
    pose_estimator = None # Set to None to prevent crashes
    anomaly_detector = None


def analyze_video(video_path, app_context):
    """
    Analyzes a video file using YOLOv11 for pose estimation and a placeholder
    anomaly detector. This is the main processing pipeline.
    """
    if not pose_estimator:
        print("Aborting analysis: Pose estimation model could not be loaded.")
        return

    print(f"Starting REAL analysis for: {video_path}")
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file {video_path}")
        return

    frame_count = 0
    fps = cap.get(cv2.CAP_PROP_FPS)
    anomaly_frame = -1

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        
        # For performance, we can analyze every Nth frame instead of all of them
        if frame_count % 3 == 0:
            results = pose_estimator.estimate_pose(frame)
            
            # --- Anomaly Detection ---
            keypoints = results.keypoints.xyn.cpu().numpy()[0] if results.keypoints.has_visible else None
            if anomaly_detector.predict(keypoints):
                anomaly_frame = frame_count
                print(f"Anomaly detected at frame {anomaly_frame}!")
                break # Stop processing this video once an anomaly is found
    
    cap.release()
    
    # --- If an anomaly was found, save clips and update database ---
    if anomaly_frame != -1:
        with app_context:
            save_incident_clips(video_path, anomaly_frame, fps, app_context.app)
    else:
        print(f"Analysis complete for {video_path}. No anomalies detected.")


def save_incident_clips(video_path, anomaly_frame, fps, app):
    """
    Saves the original clip, annotated clip, and thumbnail for a detected incident
    using a browser-compatible format (MP4/mp4v).
    """
    print("Saving incident clips...")
    
    # Define time window: 5 seconds before and 2 seconds after the anomaly
    start_frame = max(0, int(anomaly_frame - (fps * 5)))
    end_frame = int(anomaly_frame + (fps * 2))

    # --- Generate unique filenames ---
    base_filename = os.path.splitext(os.path.basename(video_path))[0]
    timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
    
    # Use the .mp4 container for browser compatibility
    thumb_fname = f"{base_filename}_{timestamp_str}_thumb.jpg"
    orig_clip_fname = f"{base_filename}_{timestamp_str}_orig.mp4"
    anno_clip_fname = f"{base_filename}_{timestamp_str}_anno.mp4"

    processed_folder = app.config['PROCESSED_DATA_FOLDER']
    thumb_path = os.path.join(processed_folder, thumb_fname)
    orig_clip_path = os.path.join(processed_folder, orig_clip_fname)
    anno_clip_path = os.path.join(processed_folder, anno_clip_fname)

    cap = cv2.VideoCapture(video_path)
    # --- Use the 'mp4v' codec for creating .mp4 files ---
    # This codec is generally included in default OpenCV builds and is browser-friendly.
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    orig_writer = cv2.VideoWriter(orig_clip_path, fourcc, fps, (width, height))
    anno_writer = cv2.VideoWriter(anno_clip_path, fourcc, fps, (width, height))

    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    current_frame = start_frame
    thumbnail_saved = False

    while current_frame <= end_frame:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Save original frame
        orig_writer.write(frame)

        # Create and save annotated frame
        results = pose_estimator.estimate_pose(frame)
        annotated_frame = results.plot() # .plot() draws the poses on the frame
        anno_writer.write(annotated_frame)
        
        # Save the frame where the anomaly occurred as the thumbnail
        if current_frame == anomaly_frame and not thumbnail_saved:
            cv2.imwrite(thumb_path, annotated_frame)
            thumbnail_saved = True

        current_frame += 1

    # Release everything
    cap.release()
    orig_writer.release()
    anno_writer.release()
    
    # --- Add the new incident to the database ---
    new_incident = Incident(
        timestamp=datetime.utcnow(),
        camera_id="CAM-02-UPLOADED",
        tracker_id=f"person_{int(time.time()) % 1000}",
        original_clip_path=orig_clip_fname,
        annotated_clip_path=anno_clip_fname,
        thumbnail_path=thumb_fname
    )
    db.session.add(new_incident)
    db.session.commit()
    print(f"Successfully saved clips and added Incident #{new_incident.id} to the database.")