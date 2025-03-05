from flask import Blueprint, request, jsonify
from Backend.models import db, Profile, User  # ✅ Import User model
from flask_cors import CORS

profile_bp = Blueprint('profile_bp', __name__)
CORS(profile_bp, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@profile_bp.route('/profile', methods=['POST'])
def create_or_update_profile():
    data = request.json

    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    profile = Profile.query.filter_by(user_id=user_id).first()
    user = User.query.get(user_id)  # ✅ Fetch user

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get form data
    full_name = data.get("full_name")
    age = data.get("age")
    gender = data.get("gender")
    location = data.get("location")
    social_background = data.get("social_background")
    phone_number = data.get("phone_number")
    image_url = data.get("image_url")

    # Ensure required fields are provided
    if not full_name or not age or not gender or not location or not phone_number:
        return jsonify({"error": "Missing required profile fields"}), 400

    # Validate image_url (must be a valid URL)
    if image_url and not image_url.startswith(("http://", "https://")):
        return jsonify({"error": "Invalid image URL"}), 400

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
        # Create new profile
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

        # ✅ Mark user profile as completed
        user.profiles_completed = True  # Assuming this is the correct column name
        db.session.commit()

        return jsonify({"message": "Profile created successfully", "profile": new_profile.to_dict()}), 201

@profile_bp.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({"profile_exists": False}), 200  # ✅ Return `profile_exists: False`
    return jsonify({"profile_exists": True, "profile": profile.to_dict()})
