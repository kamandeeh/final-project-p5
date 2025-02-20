from flask import jsonify,request,Blueprint
from models import db,User
from werkzeug.security import generate_password_hash

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/users",methods=["GET"])
def get_users():
    try:
        users=User.query.all()
        response_data = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,  
                'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
            response_data.user_append(user_data)

        return jsonify(response_data), 200
    except Exception as e:
        user_bp.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,  
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        return jsonify(user_data)
    return jsonify({"error": "User not found"}), 404


@user_bp.route('/users', methods=['POST'])
def add_users():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password_hash = generate_password_hash(data['password_hash'])

    check_username = User.query.filter_by(username=username).first()
    check_email = User.query.filter_by(email=email).first()

    print("Email ",check_email)
    print("Username",check_username)
    if check_username or check_email:
        return jsonify({"error":"Username/email exists"}),406

    else:
        new_user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg":"User saved successfully!"}), 201
    