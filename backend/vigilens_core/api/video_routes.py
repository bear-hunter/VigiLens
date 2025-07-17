# backend/vigilens_core/api/video_routes.py
import os
import threading # <-- ADDED: To run tasks in the background
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.utils import secure_filename

from ..database.models import db, Incident
from ..processing.video_processor import analyze_video # <-- ADDED: Import our analysis function

# Create a Blueprint which will be registered with the app in the factory
api_bp = Blueprint('api', __name__)

@api_bp.route('/upload', methods=['POST'])
def upload_video():
    """
    Handles video file uploads. The video is saved and a background
    thread is started to run the AI analysis.
    """
    if 'video' not in request.files:
        return jsonify({'error': 'No video part in the request'}), 400
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        # --- Trigger AI Processing in the Background ---
        # Get the current application context to pass to the thread
        app_context = current_app.app_context()
        # Create and start a new thread to run the analysis
        analysis_thread = threading.Thread(
            target=analyze_video, 
            args=(save_path, app_context)
        )
        analysis_thread.start()
        # --- End of Background Processing Trigger ---

        return jsonify({'message': f'Video "{filename}" uploaded successfully. Analysis has started.'}), 202
    
    return jsonify({'error': 'File upload failed'}), 500


@api_bp.route('/incidents', methods=['GET'])
def get_all_incidents():
    """
    Returns a list of all detected incidents.
    """
    incidents = Incident.query.order_by(Incident.timestamp.desc()).all()
    incidents_data = []
    for incident in incidents:
        incident_dict = incident.to_dict()
        incident_dict['thumbnail_url'] = url_for('serve_processed_file', filename=incident.thumbnail_path, _external=True)
        incidents_data.append(incident_dict)
        
    return jsonify(incidents_data)


@api_bp.route('/incidents/<int:id>', methods=['GET'])
def get_single_incident(id):
    """
    Returns the detailed data for a single incident, including URLs to video clips.
    """
    incident = Incident.query.get_or_404(id)
    incident_dict = incident.to_dict()

    incident_dict['original_clip_url'] = url_for('serve_processed_file', filename=incident.original_clip_path, _external=True)
    incident_dict['annotated_clip_url'] = url_for('serve_processed_file', filename=incident.annotated_clip_path, _external=True)
    incident_dict['thumbnail_url'] = url_for('serve_processed_file', filename=incident.thumbnail_path, _external=True)

    return jsonify(incident_dict)