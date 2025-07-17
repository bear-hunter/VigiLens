# backend/app.py
from flask import current_app # <-- THIS IS THE FIX
from vigilens_core import create_app
from vigilens_core.database.models import db, Incident
from datetime import datetime
import os

# Create the application instance using our factory
app = create_app()

@app.shell_context_processor
def make_shell_context():
    """
    Makes additional variables available in the Flask shell context.
    This allows for easy testing in an interactive shell.
    Run `flask shell` in the terminal to use this.
    """
    return {'db': db, 'Incident': Incident}

@app.cli.command("seed")
def seed_database():
    """
    CLI command to seed the database with dummy data for testing.
    Run `flask seed` in the terminal to execute.
    """
    print("Seeding database with dummy incident data...")

    # Create dummy file paths for demonstration
    processed_folder = current_app.config['PROCESSED_DATA_FOLDER']
    
    # Create dummy files if they don't exist
    dummy_files = ["thumb1.jpg", "original1.mp4", "annotated1.mp4", "thumb2.jpg", "original2.mp4", "annotated2.mp4"]
    for fname in dummy_files:
        path = os.path.join(processed_folder, fname)
        if not os.path.exists(path):
            with open(path, 'w') as f:
                f.write("dummy file") # create empty files

    # --- Create Incident 1 ---
    incident1 = Incident(
        timestamp=datetime.utcnow(),
        camera_id="CAM-01-ENTRANCE",
        tracker_id="person_101",
        original_clip_path="original1.mp4",
        annotated_clip_path="annotated1.mp4",
        thumbnail_path="thumb1.jpg"
    )

    # --- Create Incident 2 ---
    incident2 = Incident(
        timestamp=datetime.utcnow(),
        camera_id="CAM-04-AISLE-3",
        tracker_id="person_102",
        original_clip_path="original2.mp4",
        annotated_clip_path="annotated2.mp4",
        thumbnail_path="thumb2.jpg"
    )

    db.session.add(incident1)
    db.session.add(incident2)
    db.session.commit()
    
    print("Database seeded successfully!")


if __name__ == '__main__':
    # This block allows running the app directly with `python app.py`
    # The host='0.0.0.0' makes the server accessible on your local network.
    app.run(host='0.0.0.0', port=5000, debug=True)