from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash,generate_password_hash
from datetime import datetime
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
import firebase_admin
from firebase_admin import auth, credentials
import os

auth_bp= Blueprint("auth_bp", __name__)
CORS(auth_bp)

firebase_credentials_path = os.getenv("FIREBASE_CREDENTIALS")

if not firebase_credentials_path:
    raise ValueError("FIREBASE_CREDENTIALS environment variable not set.")

cred = credentials.Certificate(firebase_credentials_path) 
firebase_admin.initialize_app(cred)

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print("Login Attempt:", data)  # Debugging: Log request data

    user = User.query.filter_by(email=data.get("email")).first()
    
    if not user or not check_password_hash(user.password, data.get("password")):
        print("Login failed: Invalid credentials")  # Debugging
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token, user=user.to_dict()), 200


# current user
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    try:
        current_user_id = get_jwt_identity()
        print("User ID from token:", current_user_id)

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin
        }

        return jsonify(user_data), 200

    except Exception as e:
        print("Error in /current_user:", str(e)) 
        return jsonify({"error": "Invalid token or request"}), 422



# Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success":"Logged out successfully"})


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'])

    check_username = User.query.filter_by(username=username).first()
    check_email = User.query.filter_by(email=email).first()

    print("Email ",check_email)
    print("Username",check_username)
    if check_username or check_email:
        return jsonify({"error":"Username/email exists"}),406

    else:
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg":"User saved successfully!"}), 201


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
            user = User(username=username, email=email, password=generate_password_hash("social_auth"))
            db.session.add(user)
            db.session.commit()

        access_token = create_access_token(identity=user.id)

        return jsonify({
            "access_token": access_token, 
            "user": {"id": user.id, "username": user.username, "email": user.email}
        }), 200

    except Exception as e:
        print("Firebase Auth Error:", str(e))  # Debugging
        return jsonify({"error": "Invalid Firebase token or authentication failed"}), 400
