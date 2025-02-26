from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, User
from flask_cors import cross_origin

social_bp = Blueprint("social", __name__)

@social_bp.route("/social_login", methods=["POST"])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def social_login():
    try:
        data = request.json
        email = data.get("email")
        username = data.get("username", "").strip() or email.split("@")[0]
        provider = data.get("provider")
        uid = data.get("uid")  # Get Firebase UID

        if not email or not provider or not uid:
            return jsonify({"error": "Email, provider, and UID are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            # Store Firebase UID for authentication tracking
            user = User(
                username=username,
                email=email,
                uid=uid,
                provider=provider,
            )
            db.session.add(user)
            db.session.commit()
        else:
            # If user exists but is missing a UID, update it
            if not user.uid:
                user.uid = uid
                db.session.commit()

            if user.provider != provider:
                return jsonify({"error": f"User already exists with provider {user.provider}"}), 400

        access_token = create_access_token(identity=user.id)

        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "uid": user.uid,
                "provider": user.provider,
            },
            "access_token": access_token
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
