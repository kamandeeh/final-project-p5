from flask import jsonify, request, Blueprint, current_app
from models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import datetime

user_bp = Blueprint("user_bp", __name__)

# Fetch all users
@user_bp.route("/users", methods=["GET"])
def get_users():
    try:
        users = User.query.all()
        response_data = [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin,
            }
            for user in users
        ]
        return jsonify(response_data), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching users: {str(e)}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# Fetch a single user by ID
@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404  

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
        }
        return jsonify(user_data), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching user: {str(e)}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# Update user details
@user_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()

        if "email" in data and data["email"] != user.email:
            return jsonify({"error": "Unauthorized update request"}), 403

        for field in ["username", "email", "is_admin"]:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        current_app.logger.error(f"Error updating user: {str(e)}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@user_bp.route("/promote_user", methods=["PUT"])
@jwt_required()
def promote_user():
    data = request.get_json()
    email = data.get("email")  # Get the email from request body

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the is_admin status to True
    user.is_admin = True
    db.session.commit()

    return jsonify({"message": f"User with email {email} promoted to admin"}), 200


# Admin login route - CORS is now handled at the application level
@user_bp.route("/admin/login", methods=["OPTIONS", "POST"])
def admin_login():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight successful"}), 200

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    if not user.is_admin:
        return jsonify({"error": "Access denied"}), 403

    access_token = create_access_token(identity=user.id)
    
    return jsonify({"token": access_token, "is_admin": user.is_admin}), 200