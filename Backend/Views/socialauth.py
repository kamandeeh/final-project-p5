from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask_jwt_extended import create_access_token
from models import db, User
from extensions import mail
import logging

social_bp = Blueprint("social_bp", __name__)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@social_bp.route("/social_login", methods=["POST"])
def social_login():
    try:
        data = request.get_json()
        if not data:
            logging.error("❌ No JSON data received.")
            return jsonify({"error": "Invalid request. No data received."}), 400

        logging.info(f"📩 Received social login data: {data}")

        email = data.get("email")
        username = data.get("username", "Anonymous")
        uid = data.get("uid")

        if not email or not uid:
            logging.warning(f"⚠️ Missing email or UID. Data: {data}")
            return jsonify({"error": "Missing email or UID"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            try:
                user = User(email=email, username=username, uid=uid)
                db.session.add(user)
                db.session.commit()
                logging.info(f"✅ New user created: {email}, UID: {uid}")
                send_welcome_email(email, username)
            except Exception as e:
                logging.error(f"❌ Database error: {e}")
                db.session.rollback()
                return jsonify({"error": "Database error", "details": str(e)}), 500

        access_token = create_access_token(identity=str(user.id))
        logging.info(f"🔑 Access token generated for user: {user.id}")

        return jsonify({
            "message": "Social login successful",
            "user_id": user.id,
            "access_token": access_token
        }), 200

    except Exception as e:
        logging.error(f"🔥 Unexpected error in social login: {e}", exc_info=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

def send_welcome_email(email, username):
    """Send a welcome email upon first login."""
    msg = Message(
        "Welcome to Poverty Line Project! 🎉",
        recipients=[email]
    )
    msg.body = f"""
    Hi {username},

    Welcome to the Poverty Line Project! 🌍✨ We're thrilled to have you join us in making a difference.

    Start exploring now!

    Regards,
    The Poverty Line Team
    """

    try:
        mail.send(msg)
        logging.info(f"Welcome email sent to {email}")
    except Exception as e:
        logging.error(f"Error sending welcome email: {e}")
@social_bp.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    """✅ Fetch user profile by `id`, NOT `uid`."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200
