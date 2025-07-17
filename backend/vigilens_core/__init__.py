# backend/vigilens_core/__init__.py
from flask import Flask, send_from_directory, current_app
from flask_cors import CORS
from config import Config
from .database.models import db
import os

def create_app(config_class=Config):
    """
    Creates and configures an instance of the Flask application.
    """
    app = Flask(__name__, instance_relative_config=True)
    
    # 1. Load Configuration
    app.config.from_object(config_class)
    
    # 2. Initialize Extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # 3. Ensure critical directories exist
    with app.app_context():
        try:
            os.makedirs(app.instance_path)
        except OSError:
            pass
        config_class.init_app(app)

    # 4. === THIS IS THE CORRECTED ROUTE ===
    # Register a route to serve files from the processed_data folder.
    @app.route("/processed/<path:filename>")
    def processed_file(filename):
        """Serves a file from the processed data folder."""
        return send_from_directory(
            current_app.config["PROCESSED_DATA_FOLDER"], filename
        )

    # 5. Register API Blueprints
    from .api.video_routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # 6. Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    return app