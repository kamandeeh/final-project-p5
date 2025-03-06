from flask import Flask, jsonify, request, Blueprint, current_app
from Backend.models import db, ContactMessage
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager

contact_bp = Blueprint("contact_bp", __name__)
mail = Mail()

@contact_bp.route("/contact", methods=["POST"])
@jwt_required(optional=True)  # Allow both authenticated & unauthenticated users
def submit_contact():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"error": "All fields are required"}), 400

    try:
        # Save message to the database
        new_message = ContactMessage(name=name, email=email, message=message)
        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "Your message has been received. Thank you!"}), 201
    except Exception as e:
        db.session.rollback()
        print("Error saving contact message:", str(e))  # Debugging
        return jsonify({"error": "Failed to save message"}), 500

# API Endpoint to view all messages (For Admins)
@contact_bp.route("/messages", methods=["GET"])
@jwt_required()  # Require authentication
def get_messages():
    messages = ContactMessage.query.all()
    return jsonify([{"id": msg.id, "name": msg.name, "email": msg.email, "message": msg.message} for msg in messages])

