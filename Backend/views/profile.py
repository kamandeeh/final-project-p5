from flask import Blueprint, request, jsonify
from models import db, Profile
from flask_cors import CORS

profile_bp = Blueprint('profile', __name__)
CORS(profile_bp)

@profile_bp.route('/profile', methods=['POST'])
def create_profile():
    data = request.get_json()

    
    if not data.get('full_name') or not data.get('user_id'):
        return jsonify({"message": "Full name and user ID are required"}), 400

    existing_profile = Profile.query.filter_by(user_id=data['user_id']).first()
    if existing_profile:
        return jsonify({"message": "Profile for this user already exists"}), 400

    new_profile = Profile(
        full_name=data['full_name'],
        age=data.get('age'),
        gender=data.get('gender'),
        location=data.get('location'),
        social_background=data.get('social_background'),
        phone_number=data.get('phone_number'),  
        user_id=data['user_id']
    )

    try:
        db.session.add(new_profile)
        db.session.commit()

        return jsonify({"message": "Profile created successfully", "profile": new_profile.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating profile: {str(e)}"}), 500


@profile_bp.route('/profile/<int:id>', methods=['GET'])
def get_profile(id):
    profile = Profile.query.get(id)
    if profile:
        return jsonify({"profile": profile.to_dict()}), 200
    else:
        return jsonify({"message": "Profile not found"}), 404
