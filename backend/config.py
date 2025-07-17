# backend/config.py
import os

# Get the absolute path of the directory where this file is located.
# This helps make all other paths relative to the project's root.
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    """
    Base configuration class. Contains default settings and settings
    loaded from environment variables for security.
    """
    # A secret key is required by Flask for session management and other security features.
    # It's best to set this from an environment variable in a real production environment.
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-hard-to-guess-secret-string'

    # Database configuration
    # We will use SQLite for simplicity. The database file will be stored in an 'instance' folder.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'vigilens.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False # Turns off a feature that adds significant overhead

    # --- Project-Specific Paths ---
    
    # Folder where raw videos uploaded by the user will be stored.
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    
    # Folder to store processed data, like annotated video clips and thumbnails.
    PROCESSED_DATA_FOLDER = os.path.join(BASE_DIR, 'processed_data')

    # Ensure these directories exist when the application starts.
    @staticmethod
    def init_app(app):
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        os.makedirs(app.config['PROCESSED_DATA_FOLDER'], exist_ok=True)
        os.makedirs(os.path.join(BASE_DIR, 'instance'), exist_ok=True)