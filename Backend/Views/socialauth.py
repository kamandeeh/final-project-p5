from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from flask_cors import cross_origin

social_bp = Blueprint("social_bp", __name__)

@social_bp.route("/social_login", methods=["POST"])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def social_login():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415  # 415 = Unsupported Media Type

    data = request.get_json()  # ✅ Use get_json() to parse request properly
    firebase_uid = data.get('uid')

    if not firebase_uid:
        return jsonify({"error": "Missing Firebase UID"}), 400

    user = User.query.filter_by(uid=firebase_uid).first()
    
    if not user:
        print(f"Creating new user for Firebase UID: {firebase_uid}")
        user = User(email=data.get("email"), username=data.get("username"), firebase_uid=firebase_uid)
        db.session.add(user)
        db.session.commit()

    return jsonify({
        "message": "User authenticated",
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
    }), 200
