# backend/vigilens_core/processing/pose_estimator.py
import os
from ultralytics import YOLO
from config import BASE_DIR

class PoseEstimator:
    """
    A wrapper class for the YOLOv11 pose estimation model.
    """
    def __init__(self):
        # Construct the full path to the model file
        model_path = os.path.join(BASE_DIR, 'models', 'yolov11s-pose.pt')
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}. Please ensure it is placed in the 'backend/models' directory.")
            
        print(f"Loading YOLOv11 pose model from: {model_path}")
        self.model = YOLO(model_path)
        print("YOLOv11 model loaded successfully.")

    def estimate_pose(self, frame):
        """
        Performs pose estimation on a single video frame.

        :param frame: A numpy array representing the video frame.
        :return: The results object from the Ultralytics model.
        """
        # The model can take a frame directly. 'verbose=False' keeps the console clean.
        results = self.model(frame, verbose=False)
        return results[0] # Return the results for the first (and only) image