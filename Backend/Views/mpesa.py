from flask import Blueprint, request, jsonify
import requests
import base64
import datetime
import os
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define Flask Blueprint
mpesa_bp = Blueprint("mpesa_bp", __name__)

# Load environment variables
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
PASSKEY = os.getenv("PASSKEY")
CALLBACK_URL = os.getenv("CALLBACK_URL")
BUSINESS_SHORTCODE = os.getenv("BUSINESS_SHORTCODE", "174379")  # Default to 174379 (M-Pesa Sandbox)

# Debugging: Print env variables to check if they are loaded (REMOVE in production)
print(f"CONSUMER_KEY: {CONSUMER_KEY}")
print(f"CONSUMER_SECRET: {CONSUMER_SECRET}")
print(f"PASSKEY: {PASSKEY}")
print(f"CALLBACK_URL: {CALLBACK_URL}")
print(f"BUSINESS_SHORTCODE: {BUSINESS_SHORTCODE}")

# Check for missing environment variables
if not CONSUMER_KEY or not CONSUMER_SECRET or not PASSKEY or not CALLBACK_URL:
    raise ValueError("❌ Missing environment variables! Ensure CONSUMER_KEY, CONSUMER_SECRET, PASSKEY, and CALLBACK_URL are set.")

def get_access_token():
    """Generate an OAuth access token from Safaricom API."""
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    
    try:
        response = requests.get(url, auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET))
        response_data = response.json()

        # Debugging Output
        print("Access Token Response:", response_data)

        if response.status_code == 200:
            return response_data.get("access_token")
        else:
            return None
    except Exception as e:
        print("❌ Error getting access token:", str(e))
        return None


@mpesa_bp.route("/stkpush", methods=["POST"])
def stk_push():
    """Initiate M-Pesa STK Push payment request."""
    data = request.json
    phone_number = data.get("phone_number")
    amount = data.get("amount")

    if not phone_number or not amount:
        return jsonify({"error": "Phone number and amount are required"}), 400

    access_token = get_access_token()
    if not access_token:
        return jsonify({"error": "Failed to get access token"}), 500

    # Generate timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")  
    print(f"Generated TIMESTAMP: {timestamp}")

    # Ensure all values are strings before concatenation
    password_string = f"{BUSINESS_SHORTCODE}{PASSKEY}{timestamp}"
    password = base64.b64encode(password_string.encode()).decode()
    
    print(f"Generated PASSWORD: {password}")  # Debugging

    # STK Push request payload
    payload = {
        "BusinessShortCode": BUSINESS_SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": BUSINESS_SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": "Test Payment",
        "TransactionDesc": "M-Pesa STK Push Payment"
    }

    print("STK Push Payload:", payload)  # Debugging

    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response_data = response.json()

        print("STK Push Response:", response_data)  # Debugging

        return jsonify(response_data)
    except Exception as e:
        print("❌ Error during STK Push request:", str(e))
        return jsonify({"error": "Failed to process STK Push request"}), 500
