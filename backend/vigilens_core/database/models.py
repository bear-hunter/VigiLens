# backend/vigilens_core/database/models.py
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Create a SQLAlchemy instance. We will initialize it later in our app factory.
db = SQLAlchemy()

class Incident(db.Model):
    """
    Represents a detected suspicious event in the database.
    Each attribute corresponds to a column in the 'incident' table.
    """
    id = db.Column(db.Integer, primary_key=True)
    
    # --- Event Details ---
    # The exact time the suspicious activity was flagged.
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Identifier for the camera that captured the footage.
    camera_id = db.Column(db.String(50), nullable=False, default='Camera 1')
    
    # A unique ID assigned to the person being tracked within a single video feed.
    tracker_id = db.Column(db.String(50), nullable=True)
    
    # --- Associated File Paths ---
    # We store relative paths to the files. The full path is constructed at runtime.
    
    # Path to the short video clip showing the original, unprocessed footage.
    original_clip_path = db.Column(db.String(255), nullable=False)
    
    # Path to the AI-annotated video clip (e.g., with pose skeletons).
    annotated_clip_path = db.Column(db.String(255), nullable=False)
    
    # Path to a single-frame image used as a preview on the dashboard.
    thumbnail_path = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        """
        Serializes the Incident object into a dictionary so it can be easily
        converted to JSON and sent to the frontend.
        """
        # Note: The URLs are constructed in the API route, not here.
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat() + 'Z', # Use ISO 8601 format
            'camera_id': self.camera_id,
            'tracker_id': self.tracker_id,
            # These paths will be converted to full URLs by the API
            'original_clip_path': self.original_clip_path,
            'annotated_clip_path': self.annotated_clip_path,
            'thumbnail_path': self.thumbnail_path,
        }