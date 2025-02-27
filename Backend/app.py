from flask import Flask
from flask_migrate import Migrate
from models import db,TokenBlocklist
from datetime import timedelta
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db.init_app(app)
migrate = Migrate(app, db)


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "uhdhfjhfjksddjhdyd")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] =  timedelta(hours=1)
jwt = JWTManager(app)
jwt.init_app(app)

from views import *


app.register_blueprint(user_bp)
app.register_blueprint(record_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(mpesa_bp)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None


