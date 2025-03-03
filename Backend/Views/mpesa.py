from flask import Blueprint, request, jsonify
import requests
import base64
import datetime
import os
from requests.auth import HTTPBasicAuth

# Define Flask Blueprint
mpesa_bp = Blueprint("mpesa_bp", __name__)

# Load environment variables
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
PASSKEY = os.getenv("PASSKEY")
CALLBACK_URL = os.getenv("CALLBACK_URL")

# Business Shortcode for Sandbox
BUSINESS_SHORTCODE = "174379"

def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(url, auth=HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET))
    
    print("Response Status:", response.status_code)
    print("Response Data:", response.text)

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        return None


@mpesa_bp.route("/stkpush", methods=["POST"])
def stk_push():
    data = request.json
    phone_number = data.get("phone_number")
    amount = data.get("amount")

    if not phone_number or not amount:
        return jsonify({"error": "Phone number and amount are required"}), 400

    access_token = get_access_token()
    if not access_token:
        return jsonify({"error": "Failed to get access token"}), 500

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode((BUSINESS_SHORTCODE + PASSKEY + timestamp).encode()).decode()

    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
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
    response = requests.post(url, json=payload, headers=headers)
    print("STK Push Response:", response.text)  # Debugging
    
    return jsonify(response.json())
