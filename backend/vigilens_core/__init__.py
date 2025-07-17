# backend/vigilens_core/__init__.py
from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from .database.models import db
import os

# The function must be named exactly 'create_app'
def create_app(config_class=Config):
    """
    Creates and configures an instance of the Flask application.
    
    This function is known as the 'Application Factory'. It allows for creating
    multiple instances of the app with different configurations, which is
    great for testing.
    """
    app = Flask(__name__, instance_relative_config=True)
    
    # 1. Load Configuration
    app.config.from_object(config_class)
    
    # 2. Initialize Extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}) # Enable CORS for all API routes

    # 3. Ensure instance folder exists and initialize required directories
    with app.app_context():
        # This checks if the 'instance' folder exists and makes it if not.
        try:
            os.makedirs(app.instance_path)
        except OSError:
            pass
        # The static method from our Config class is called here.
        config_class.init_app(app)

    # 4. Define a route to serve processed files
    @app.route('/processed/<path:filename>')
    def serve_processed_file(filename):
        return send_from_directory(
            app.config['PROCESSED_DATA_FOLDER'],
            filename,
            as_attachment=False
        )

    # 5. Register Blueprints (API routes)
    from .api.video_routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # 6. Create database tables
    with app.app_context():
        db.create_all()

    return app