from flask import jsonify, request, Blueprint
from Backend.models import db, User, TokenBlocklist
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
import firebase_admin
from firebase_admin import auth

auth_bp = Blueprint("auth_bp", __name__)
CORS(auth_bp, supports_credentials=True)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

    # Check if user already exists
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"error": "Username/email exists"}), 406

    # Create new user with hashed password
    new_user = User(username=username, email=email)
    new_user.set_password(password)  # Hash password before saving
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404  

    if not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    print("User found:", user) 
    print("User ID:", user.id)  

    # Generate JWT token
    access_token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
        }
    })

@auth_bp.route("/auth/firebase", methods=["POST"])
def firebase_auth():
    data = request.get_json()
    firebase_token = data.get("token")

    if not firebase_token:
        return jsonify({"error": "Missing Firebase token"}), 400

    try:
        decoded_token = auth.verify_id_token(firebase_token)
        email = decoded_token.get("email")
        username = decoded_token.get("name")

        if not email:
            return jsonify({"error": "Firebase authentication failed: No email provided"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(username=username, email=email)
            user.set_password("social_auth") 
            db.session.add(user)
            db.session.commit()

        access_token = create_access_token(identity=user.id)

        return jsonify({
            "access_token": access_token, 
            "user": {"id": user.id, "username": user.username, "email": user.email}
        }), 200

    except Exception as e:
        print("Firebase Auth Error:", str(e)) 
        return jsonify({"error": "Invalid Firebase token or authentication failed"}), 400

@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    try:
        current_user_id = get_jwt_identity()
        print("User ID from token:", current_user_id)

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email
        }), 200

    except Exception as e:
        print("Error in /current_user:", str(e)) 
        return jsonify({"error": "Invalid token or request"}), 422

# ✅ Fix Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success": "Logged out successfully"})
