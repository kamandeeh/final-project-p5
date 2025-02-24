from flask import jsonify, request, Blueprint, url_for, redirect, session, abort
from authlib.integrations.flask_client import OAuth
from flask_dance.contrib.github import make_github_blueprint, github
from flask_jwt_extended import create_access_token
import requests
import os
from dotenv import load_dotenv
from models import db, User
import json

load_dotenv()
social_bp = Blueprint("social_bp", __name__)

# OAuth Configuration
oauth = OAuth()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")


oauth.register(
    "google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://oauth2.googleapis.com/token",
    userinfo_endpoint="https://openidconnect.googleapis.com/v1/userinfo",
    client_kwargs={"scope": "openid email profile"},
)


github_blueprint = make_github_blueprint(
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    scope="user:email"
)


def login_is_required(function):
    def wrapper(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)  # Unauthorized
        return function(*args, **kwargs)
    return wrapper

@social_bp.route("/auth/google/login")
def google_login():
    return oauth.google.authorize_redirect("http://127.0.0.1:5000/auth/google/callback")


@social_bp.route("/auth/google/callback")
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = token.get("userinfo")

        if not user_info:
            return jsonify({"error": "Failed to fetch user info"}), 400

        email = user_info.get("email")
        google_id = user_info.get("sub")  
        username = user_info.get("name")

        session["google_id"] = google_id
        session["email"] = email
        session["username"] = username

    
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(username=username, email=email, google_id=google_id)
            db.session.add(user)
            db.session.commit()

        jwt_token = create_access_token(identity=user.id)

        return jsonify({"message": "Login successful", "access_token": jwt_token, "user": user_info})

    except Exception as e:
        return jsonify({"error": "Google authentication failed", "details": str(e)}), 500

@social_bp.route("/auth/google/logout")
def google_logout():
    session.clear()
    return jsonify({"message": "Logged out successfully!"})

@social_bp.route("/auth/google/protected_area")
@login_is_required
def google_protected_area():
    return jsonify({
        "message": "Welcome to the protected area!",
        "user": {
            "google_id": session.get("google_id"),
            "email": session.get("email"),
            "username": session.get("username"),
        }
    })

@social_bp.route("/auth/github/login")
def github_login():
    if not github.authorized:
        return redirect(url_for('github.login'))
    else:
        account_info = github.get('/user')
        if account_info.ok:
            account_info_json = account_info.json()
            return '<h1>Your Github name is {}'.format(account_info_json['login'])

    return '<h1>Request failed!</h1>'

@social_bp.route("/auth/github/callback")
def github_callback():
    if not github.authorized:
        return jsonify({"error": "GitHub authorization failed"}), 401

    # Get user information from GitHub
    account_info = github.get("/user")
    user_info = account_info.json()
    user_id = user_info['id']
    email = user_info.get("email")

    if not email:
        email_list = github.get(f"/users/{user_id}/emails").json()
        email = next((e["email"] for e in email_list if e.get("primary") and e.get("verified")), None)

    if not email:
        return jsonify({"error": "GitHub account has no public email"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(username=user_info["login"], email=email, github_id=user_info["id"])
        db.session.add(user)
        db.session.commit()

    jwt_token = create_access_token(identity=user.id)

    return jsonify({"message": "GitHub login successful", "access_token": jwt_token, "user": user_info})


@social_bp.route("/auth/github/logout")
def github_logout():
    session.clear()
    return jsonify({"message": "Logged out from GitHub successfully!"})

@social_bp.route("/")
def index():
    return jsonify({
        "message": "Welcome to the OAuth Demo",
        "login_google": url_for("social_bp.google_login", _external=True),
        "login_github": url_for("github.login", _external=True),
        "logout_google": url_for("social_bp.google_logout", _external=True),
        "logout_github": url_for("social_bp.github_logout", _external=True),
        "protected_area_google": url_for("social_bp.google_protected_area", _external=True),
    })
