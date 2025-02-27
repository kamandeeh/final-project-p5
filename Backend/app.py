from flask import Flask
from flask_migrate import Migrate
from models import db,TokenBlocklist
from datetime import timedelta
from flask_jwt_extended import JWTManager
import os
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config["SECRET_KEY"] = "zuruelkamandepovertylineproject"
db.init_app(app)
migrate = Migrate(app, db)


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "uhdhfjhfjksddjhdyd")
app.config["JWT_ALGORITHM"] = "HS256" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  timedelta(hours=1)
jwt = JWTManager(app)
jwt.init_app(app)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

from views import *


app.register_blueprint(user_bp)
app.register_blueprint(record_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(mpesa_bp)
app.register_blueprint(social_bp)
app.register_blueprint(county_bp)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

@app.after_request
def set_headers(response):
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    response.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    return response