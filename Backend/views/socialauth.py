from flask import jsonify, request, Blueprint, url_for, redirect
from authlib.integrations.flask_client import OAuth
import requests
from flask_jwt_extended import create_access_token
import os
from dotenv import load_dotenv
from models import db,User

load_dotenv()
auth_bp = Blueprint("auth_bp", __name__)

# OAuth Configuration
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
