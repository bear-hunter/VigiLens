# backend/vigilens_core/__init__.py
import os
from flask import Flask, send_from_directory, current_app
from flask_cors import CORS
from config import Config
from .database.models import db

def create_app(config_class=Config):
    # --- THIS IS THE CRUCIAL CHANGE ---
    # We tell Flask where to find the built React app's static files.
    # The path navigates out of 'backend' and into 'frontend/dist'.
    static_folder_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist'))

    app = Flask(
        __name__,
        instance_relative_config=True,
        static_folder=static_folder_path, # Set the static folder
        static_url_path='' # Serve it from the root URL
    )
    
    app.config.from_object(config_class)
    CORS(app) # Keep CORS for general API safety
    db.init_app(app)

    with app.app_context():
        try:
            os.makedirs(app.instance_path)
        except OSError:
            pass
        config_class.init_app(app)

    # Route to serve processed video files
    @app.route("/processed/<path:filename>")
    def processed_file(filename):
        return send_from_directory(
            current_app.config["PROCESSED_DATA_FOLDER"], filename
        )

    # Register API Blueprints
    from .api.video_routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # --- THIS ROUTE SERVES THE REACT APP ---
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react_app(path):
        """Serves the main index.html for any non-API, non-file route."""
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    with app.app_context():
        db.create_all()

    return app