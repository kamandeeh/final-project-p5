from flask import Flask,jsonify,request
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash
from models import db,User,Profile,Record
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db.init_app(app)
migrate = Migrate(app, db)

@app.route("/users",methods=["GET"])
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
            response_data.append(user_data)

        return jsonify(response_data), 200
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


@app.route('/users/<int:user_id>', methods=['GET'])
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


@app.route('/users', methods=['POST'])
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
    
@app.route("/record",methods=["GET"])
def get_records():
    try:
        records=Record.query.all()
        records_list=[]
        for record in records:
            record_data={
                'id':record.id,
                'county':record.county, 
                'description':record.description,
                'category':record.category,
                'created_at':record.created_at,
                'updated_at': record.updated_at
            }
            records_list.append(record_data)
        return jsonify(records_list), 200
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


@app.route("/record/<int:id>", methods=['PUT'])
def update_record(id):
    try:
        record = Record.query.get(id)
        if not record:
            return jsonify({"error": "Record not found"}), 404

        data = request.get_json()
        
        # Update only provided fields
        if 'county' in data:
            record.county = data['county']
        if 'description' in data:
            record.description = data['description']
        if 'category' in data:
            record.category = data['category']

        db.session.commit()

        return jsonify({
            "message": "Record updated successfully",
            "record": {
                "id": record.id,
                "county": record.county,
                "description": record.description,
                "category": record.category,
                "created_at": record.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": record.updated_at.strftime('%Y-%m-%d %H:%M:%S') if record.updated_at else None
            }
        }), 200

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    
    
@app.route("/record", methods=['POST'])
def create_record():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['county', 'description', 'category']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"'{field}' is required"}), 400

        # Create new record
        new_record = Record(
            county=data['county'],
            description=data['description'],
            category=data['category']
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "message": "Record created successfully",
            "record": {
                "id": new_record.id,
                "county": new_record.county,
                "description": new_record.description,
                "category": new_record.category,
                "created_at": new_record.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": new_record.updated_at.strftime('%Y-%m-%d %H:%M:%S') if new_record.updated_at else None
            }
        }), 201

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


        

    
    