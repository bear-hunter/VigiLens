# backend/vigilens_core/processing/video_processor.py
import os
import cv2
import time
import shutil
import subprocess # <-- IMPORT FOR RUNNING COMMANDS
from datetime import datetime
from ..database.models import db, Incident
from .pose_estimator import PoseEstimator
from .anomaly_detector import AnomalyDetector

# (The top part with model loading and analyze_video is the same)
try:
    pose_estimator = PoseEstimator()
    anomaly_detector = AnomalyDetector()
except FileNotFoundError as e:
    print(f"CRITICAL ERROR: {e}")
    pose_estimator = None; anomaly_detector = None
def analyze_video(video_path, app_context):
    if not pose_estimator: print("Aborting analysis: Model not loaded."); return
    print(f"Starting REAL analysis for: {video_path}")
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened(): print(f"Error: Could not open video file {video_path}"); return
    frame_count = 0; fps = cap.get(cv2.CAP_PROP_FPS); anomaly_frame = -1
    while True:
        ret, frame = cap.read();
        if not ret: break
        frame_count += 1
        if frame_count % 3 == 0:
            results = pose_estimator.estimate_pose(frame)
            keypoints = results.keypoints.xyn.cpu().numpy()[0] if results.keypoints.has_visible else None
            if anomaly_detector.predict(keypoints):
                anomaly_frame = frame_count; print(f"Anomaly detected at frame {anomaly_frame}!"); break
    cap.release()
    if anomaly_frame != -1:
        with app_context: save_incident_clips(video_path, anomaly_frame, fps, app_context.app)
    else: print(f"Analysis complete for {video_path}. No anomalies detected.")

# --- THIS IS THE FINAL, WORKING VERSION ---
def save_incident_clips(video_path, anomaly_frame, fps, app):
    print("Saving incident clips using FFmpeg...")
    
    base_filename = os.path.splitext(os.path.basename(video_path))[0]
    timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")
    
    thumb_fname = f"{base_filename}_{timestamp_str}_thumb.jpg"
    orig_clip_fname = f"{base_filename}_{timestamp_str}_orig.mp4"
    anno_clip_fname = f"{base_filename}_{timestamp_str}_anno.mp4"

    processed_folder = app.config['PROCESSED_DATA_FOLDER']
    thumb_path = os.path.join(processed_folder, thumb_fname)
    orig_clip_path = os.path.join(processed_folder, orig_clip_fname)
    anno_clip_path = os.path.join(processed_folder, anno_clip_fname)

    # --- 1. Create the Original Clip using a direct copy (fast and reliable) ---
    shutil.copy(video_path, orig_clip_path)

    # --- 2. Create the Annotated Clip using FFmpeg (robust) ---
    # Create a temporary directory to store the annotated frames
    temp_frame_folder = os.path.join(processed_folder, f"temp_{timestamp_str}")
    os.makedirs(temp_frame_folder, exist_ok=True)
    
    print(f"Generating annotated frames in {temp_frame_folder}...")
    cap = cv2.VideoCapture(video_path)
    start_frame = max(0, int(anomaly_frame - (fps * 5)))
    end_frame = int(anomaly_frame + (fps * 2))
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
    current_frame = start_frame
    thumbnail_saved = False

    while current_frame <= end_frame:
        ret, frame = cap.read()
        if not ret: break
        results = pose_estimator.estimate_pose(frame)
        annotated_frame = results.plot()
        
        # Save each frame as a numbered image
        frame_filename = os.path.join(temp_frame_folder, f"frame_{current_frame:06d}.png")
        cv2.imwrite(frame_filename, annotated_frame)
        
        if current_frame == anomaly_frame and not thumbnail_saved:
            cv2.imwrite(thumb_path, annotated_frame)
            thumbnail_saved = True
        current_frame += 1
    cap.release()
    
    # --- 3. Use FFmpeg to stitch the frames into a video ---
    print("Stitching frames into video with FFmpeg...")
    ffmpeg_command = [
        'ffmpeg',
        '-y',  # Overwrite output file if it exists
        '-framerate', str(fps),
        '-i', os.path.join(temp_frame_folder, 'frame_%06d.png'),
        '-c:v', 'libx264',  # The standard H.264 codec
        '-pix_fmt', 'yuv420p', # Pixel format for wide compatibility
        anno_clip_path
    ]
    subprocess.run(ffmpeg_command, check=True, capture_output=True, text=True)

    # --- 4. Clean up the temporary frames ---
    print("Cleaning up temporary frames...")
    shutil.rmtree(temp_frame_folder)
    
    # --- 5. Add the new incident to the database ---
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