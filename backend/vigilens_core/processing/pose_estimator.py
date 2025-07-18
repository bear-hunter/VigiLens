# backend/vigilens_core/processing/pose_estimator.py
import os
from ultralytics import YOLO
from config import BASE_DIR

class PoseEstimator:
    def __init__(self):
        model_path = os.path.join(BASE_DIR, 'models', 'yolov11s-pose.pt')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}.")
        print(f"Loading YOLOv11 pose model from: {model_path}")
        self.model = YOLO(model_path)
        print("YOLOv11 model loaded successfully.")

    def estimate_pose(self, frame):
        results = self.model(frame, verbose=False)
        return results[0]