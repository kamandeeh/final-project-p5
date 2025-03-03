from flask import Blueprint, request, jsonify, current_app
from models import db, Profile
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

profile_bp = Blueprint('profile', __name__)
CORS(profile_bp, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


@profile_bp.route('/profile', methods=['POST'])
def create_or_update_profile():
    user_id = request.json.get("user_id")  # Ensure correct user_id retrieval
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    profile = Profile.query.filter_by(user_id=user_id).first()  # Check if profile exists

    # Get form data
    full_name = request.json.get("full_name")
    age = request.json.get("age")
    gender = request.json.get("gender")
    location = request.json.get("location")
    social_background = request.json.get("social_background")
    phone_number = request.json.get("phone_number")
    image_url = request.json.get("image_url")  # Expecting a string, not a file

    if profile:
        # Update existing profile
        profile.full_name = full_name
        profile.age = age
        profile.gender = gender
        profile.location = location
        profile.social_background = social_background
        profile.phone_number = phone_number
        profile.image_url = image_url
        db.session.commit()
        return jsonify({"message": "Profile updated successfully", "profile": profile.to_dict()}), 200
    else:
        # Create a new profile if none exists
        new_profile = Profile(
            user_id=user_id,
            full_name=full_name,
            age=age,
            gender=gender,
            location=location,
            social_background=social_background,
            phone_number=phone_number,
            image_url=image_url,
        )
        db.session.add(new_profile)
        db.session.commit()
        return jsonify({"message": "Profile created successfully", "profile": new_profile.to_dict()}), 201

@profile_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({"profile": profile.to_dict()})

@profile_bp.route('/profile/upload', methods=['POST'])
def upload_profile_picture():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file.save(os.path.join("uploads", filename))  # Save to 'uploads/' directory

    return jsonify({"message": "File uploaded successfully", "image_url": f"/uploads/{filename}"}), 200


