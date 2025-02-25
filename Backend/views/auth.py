from flask import jsonify, request, Blueprint
from models import db, User, TokenBlocklist
from werkzeug.security import check_password_hash,generate_password_hash
from datetime import datetime
from datetime import timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS

auth_bp= Blueprint("auth_bp", __name__)
CORS(auth_bp)

# Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password ) :
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200

    else:
        return jsonify({"error": "Either email/password is incorrect"}), 404


# current user
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    try:
        current_user_id = get_jwt_identity()
        print("User ID from token:", current_user_id)

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin
        }

        return jsonify(user_data), 200

    except Exception as e:
        print("Error in /current_user:", str(e)) 
        return jsonify({"error": "Invalid token or request"}), 422



# Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success":"Logged out successfully"})


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'])

    check_username = User.query.filter_by(username=username).first()
    check_email = User.query.filter_by(email=email).first()

    print("Email ",check_email)
    print("Username",check_username)
    if check_username or check_email:
        return jsonify({"error":"Username/email exists"}),406

    else:
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg":"User saved successfully!"}), 201
