import os
import json
from flask import Flask
from flask_migrate import Migrate
from models import db, TokenBlocklist
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
import firebase_admin
from firebase_admin import credentials
from extensions import mail

# Get the directory of the current script
basedir = os.path.abspath(os.path.dirname(__file__))
print(f"Current working directory: {os.getcwd()}")
print(f"Base directory: {basedir}")

# Use a relative path for Firebase credentials
firebase_credentials_path = os.path.join(basedir, "poverty-line-5ed46-firebase-adminsdk-fbsvc-fa9a2b2116.json")
print(f"Looking for Firebase credentials at: {firebase_credentials_path}")
print(f"File exists: {os.path.exists(firebase_credentials_path)}")

# Initialize Firebase
if os.path.exists(firebase_credentials_path):
    # Use the file if it exists
    cred = credentials.Certificate(firebase_credentials_path)
    print("Successfully loaded Firebase credentials from file")
elif os.environ.get('FIREBASE_CREDENTIALS'):
    # Fall back to environment variable if available
    try:
        cred_dict = json.loads(os.environ.get('FIREBASE_CREDENTIALS'))
        cred = credentials.Certificate(cred_dict)
        print("Successfully loaded Firebase credentials from environment variable")
    except json.JSONDecodeError as e:
        print(f"Error parsing Firebase credentials JSON: {e}")
        raise
else:
    raise FileNotFoundError("Firebase credentials not found in file or environment variable")

firebase_admin.initialize_app(cred)

# Rest of your code remains unchanged

# Rest of your code remains the same...

# ✅ Initialize Flask App
app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(basedir, 'app.db')}"

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

db.init_app(app)
migrate = Migrate(app, db)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default_jwt_secret")
app.config["JWT_ALGORITHM"] = "HS256"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

# ✅ Allow Frontend URL
cors_origin = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, resources={r"/*": {"origins": cors_origin}}, supports_credentials=True)
mail.init_app(app)

# ✅ Configure Flask-Mail
app.config['MAIL_SERVER'] = "smtp.gmail.com"
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD") 
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER")

mail = Mail(app)

# ✅ Import and Register Blueprints
from Views import *

app.register_blueprint(user_bp)
app.register_blueprint(record_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(social_bp)
app.register_blueprint(mpesa_bp)
app.register_blueprint(county_stats_bp)
app.register_blueprint(contact_bp)

# ✅ JWT Blocklist Check
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None

# ✅ Fix COOP/COEP Issues
@app.after_request
def set_headers(response):
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    return response

if __name__ == "__main__":
    app.run(debug=True)