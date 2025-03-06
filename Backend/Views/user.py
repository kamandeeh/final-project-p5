from flask import jsonify, request, Blueprint, current_app
from  Backend.models import db, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import check_password_hash
import jwt
import datetime

user_bp = Blueprint("user_bp", __name__)
CORS(user_bp, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


# Fetch all users
@user_bp.route("/users", methods=["GET"])
def get_users():
    try:
        users = User.query.all()
        response_data = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,  
                'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            response_data.append(user_data)  # Fixed the typo

        return jsonify(response_data), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching users: {str(e)}")  # Unified logging
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Fetch a single user by ID
@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404  

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,  
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        return jsonify(user_data), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching user: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Update user details without requiring an access token
@user_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()

        if "email" in data and data["email"] != user.email:
            return jsonify({"error": "Unauthorized update request"}), 403

        allowed_fields = ["username", "email", "is_admin"]
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()

        return jsonify({
            "message": "User updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error updating user: {str(e)}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@user_bp.route("/promote_user/<int:user_id>", methods=["PUT"])
@jwt_required()
def promote_user(user_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    target_user = User.query.get(user_id)
    if not target_user:
        return jsonify({"error": "User not found"}), 404

    target_user.is_admin = True
    db.session.commit()
    return jsonify({"message": "User promoted to admin"}), 200

@user_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()

    # Check if the request contains email and password
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password are required."}), 400

    # Query the user from the database
    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password, data['password']):
        # User found and password matches, create a JWT token
        token = jwt.encode({
            'sub': user.email,
            'is_admin': user.is_admin,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "token": token,
            "is_admin": user.is_admin
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401



