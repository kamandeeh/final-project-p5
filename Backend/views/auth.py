from flask import jsonify, request, Blueprint, url_for, redirect
from authlib.integrations.flask_client import OAuth
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Blueprint
auth_bp = Blueprint("auth_bp", __name__)

# Initialize OAuth
oauth = OAuth()

# OAuth Configuration
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# Register Google OAuth
oauth.register(
    "google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://oauth2.googleapis.com/token",
    userinfo_endpoint="https://openidconnect.googleapis.com/v1/userinfo",
    client_kwargs={"scope": "openid email profile"},
)

# ----------------- USER AUTHENTICATION ROUTES -----------------

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON input"}), 400

        email = data.get("email", "").strip()
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()  # Ensure password is a string

        if not email or not username or not password:
            return jsonify({"error": "All fields are required"}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409

        # Ensure password is not None before hashing
        hashed_password = generate_password_hash(password) if password else None
        if not hashed_password:
            return jsonify({"error": "Invalid password"}), 400

        new_user = User(username=username, email=email, password_hash=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        print(f"Error: {e}")  
        return jsonify({"error": "Server error"}), 500

    

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.password_hash and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200

    return jsonify({"error": "Either email/password is incorrect"}), 401




@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_admin": user.is_admin
    })



@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti, created_at=datetime.now(timezone.utc)))
    db.session.commit()
    return jsonify({"message": "Logged out successfully"}), 200


# ----------------- GOOGLE AUTHENTICATION -----------------

@auth_bp.route("/auth/google")
def google_login():
    return oauth.google.authorize_redirect(url_for("auth_bp.google_callback", _external=True))


@auth_bp.route("/auth/google/callback")
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get("userinfo")
        if not user_info:
            return jsonify({"error": "Failed to fetch user info"}), 400

        email = user_info["email"]
        user = User.query.filter_by(email=email).first()

        if not user:
            user = User(username=user_info["name"], email=email)
            db.session.add(user)
            db.session.commit()

        jwt_token = create_access_token(identity=user.id)
        return jsonify({"access_token": jwt_token, "user": user_info})

    except Exception as e:
        return jsonify({"error": "Google authentication failed", "details": str(e)}), 500


# ----------------- GITHUB AUTHENTICATION -----------------

@auth_bp.route("/auth/github")
def github_login():
    github_auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=user:email"
    return redirect(github_auth_url)


@auth_bp.route("/auth/github/callback")
def github_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Authorization code is required"}), 400

    # Exchange code for access token
    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        },
    )

    token_data = token_response.json()
    access_token = token_data.get("access_token")
    if not access_token:
        return jsonify({"error": "Failed to authenticate with GitHub"}), 400

    # Fetch user info from GitHub
    user_response = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"token {access_token}"},
    )
    user_data = user_response.json()

    # Fetch user's primary email
    email = user_data.get("email")
    if not email:
        email_response = requests.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"token {access_token}"},
        )
        emails = email_response.json()
        primary_email = next((e["email"] for e in emails if e.get("primary")), None)
        email = primary_email or f"github_{user_data['id']}@example.com"

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(username=user_data["login"], email=email)
        db.session.add(user)
        db.session.commit()

    jwt_token = create_access_token(identity=user.id)
    return jsonify({"access_token": jwt_token, "user": user_data})
