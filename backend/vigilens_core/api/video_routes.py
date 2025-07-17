# backend/vigilens_core/api/video_routes.py
import os
import threading
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.utils import secure_filename

from ..database.models import db, Incident
from ..processing.video_processor import analyze_video

api_bp = Blueprint('api', __name__)

@api_bp.route('/upload', methods=['POST'])
def upload_video():
    # This function is correct and does not need changes.
    if 'video' not in request.files:
        return jsonify({'error': 'No video part in the request'}), 400
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)
        app_context = current_app.app_context()
        analysis_thread = threading.Thread(
            target=analyze_video, args=(save_path, app_context)
        )
        analysis_thread.start()
        return jsonify({'message': f'Video "{filename}" uploaded successfully. Analysis has started.'}), 202
    return jsonify({'error': 'File upload failed'}), 500


@api_bp.route('/incidents', methods=['GET'])
def get_all_incidents():
    incidents = Incident.query.order_by(Incident.timestamp.desc()).all()
    incidents_data = []
    for incident in incidents:
        incident_dict = incident.to_dict()
        # === USE CORRECT ENDPOINT NAME ===
        incident_dict['thumbnail_url'] = url_for('processed_file', filename=incident.thumbnail_path, _external=True)
        incidents_data.append(incident_dict)
    return jsonify(incidents_data)


@api_bp.route('/incidents/<int:id>', methods=['GET'])
def get_single_incident(id):
    incident = Incident.query.get_or_404(id)
    incident_dict = incident.to_dict()
    # === USE CORRECT ENDPOINT NAME ===
    incident_dict['original_clip_url'] = url_for('processed_file', filename=incident.original_clip_path, _external=True)
    incident_dict['annotated_clip_url'] = url_for('processed_file', filename=incident.annotated_clip_path, _external=True)
    incident_dict['thumbnail_url'] = url_for('processed_file', filename=incident.thumbnail_path, _external=True)
    return jsonify(incident_dict)