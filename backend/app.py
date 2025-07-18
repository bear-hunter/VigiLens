from flask import current_app
from vigilens_core import create_app
from vigilens_core.database.models import db, Incident
from datetime import datetime
import os
from waitress import serve # <-- IMPORT WAITRESS

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Incident': Incident}

@app.cli.command("seed")
def seed_database():
    # This function remains the same
    print("Seeding database with dummy incident data...")
    with app.app_context():
        processed_folder = current_app.config['PROCESSED_DATA_FOLDER']
        dummy_files = ["thumb1.jpg", "original1.mp4", "annotated1.mp4"]
        for fname in dummy_files:
            path = os.path.join(processed_folder, fname)
            if not os.path.exists(path):
                with open(path, 'w') as f:
                    f.write("dummy file")
        
        incident1 = Incident(
            timestamp=datetime.utcnow(),
            camera_id="CAM-01-SEED",
            tracker_id="person_seed_1",
            original_clip_path="original1.mp4",
            annotated_clip_path="annotated1.mp4",
            thumbnail_path="thumb1.jpg"
        )
        db.session.add(incident1)
        db.session.commit()
        print("Database seeded successfully!")


if __name__ == '__main__':
    # --- THIS IS THE CRUCIAL CHANGE ---
    # We are no longer using app.run().
    # We are now using Waitress, a production-ready server that
    # correctly handles video streaming.
    print("Starting server with Waitress on http://127.0.0.1:5000")
    serve(app, host='127.0.0.1', port=5000)