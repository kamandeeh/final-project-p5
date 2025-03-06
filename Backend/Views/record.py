from flask import Blueprint, request, jsonify, current_app
from models import db, Record, User
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
import random

record_bp = Blueprint("record_bp", __name__)
CORS(record_bp, supports_credentials=True)

# Admin authentication decorator
def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return func(*args, **kwargs)
    return wrapper

# Get all records
@record_bp.route("/records", methods=["GET"])
def get_records():
    try:
        records = Record.query.all()
        return jsonify([record.serialize() for record in records]), 200
    except Exception as e:
        current_app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Get a specific record
@record_bp.route("/record/<int:id>", methods=['GET'])
def get_record(id):
    record = Record.query.get(id)
    if not record:
        return jsonify({"error": "Record not found"}), 404
    return jsonify(record.serialize()), 200

# Create a new record (Admin only)
@record_bp.route("/record", methods=['POST'])
@admin_required
def create_record():
    try:
        data = request.get_json()
        required_fields = ['county', 'description', 'category']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"'{field}' is required"}), 400

        new_record = Record(
            county=data['county'],
            description=data['description'],
            category=data['category']
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({"message": "Record created successfully", "record": new_record.serialize()}), 201
    except Exception as e:
        current_app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Update an existing record (Admin only)
@record_bp.route("/record/<int:id>", methods=['PUT'])
@admin_required
def update_record(id):
    try:
        record = Record.query.get(id)
        if not record:
            return jsonify({"error": "Record not found"}), 404

        data = request.get_json()
        if 'county' in data:
            record.county = data['county']
        if 'description' in data:
            record.description = data['description']
        if 'category' in data:
            record.category = data['category']

        db.session.commit()
        return jsonify({"message": "Record updated successfully", "record": record.serialize()}), 200
    except Exception as e:
        current_app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Delete a record (Admin only)
@record_bp.route("/record/<int:id>", methods=['DELETE'])
@admin_required
def delete_record(id):
    try:
        record = Record.query.get(id)
        if not record:
            return jsonify({"error": "Record not found"}), 404
        
        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Record deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Search for records
@record_bp.route("/search", methods=["GET"])
def search_records():
    query = request.args.get("query", "").strip()
    if not query:
        return jsonify({"error": "Search query is required"}), 400

    results = Record.query.filter(Record.county.ilike(f"%{query}%")).all()
    return jsonify([record.serialize() for record in results]), 200

# Get random counties
@record_bp.route('/random_counties', methods=['GET'])
def get_random_counties():
    counties = Record.query.all()
    
    if not counties:
        return jsonify([]) 

    random_counties = random.sample(counties, min(3, len(counties))) 
    
    return jsonify([{"county": c.county, "category": c.category} for c in random_counties])
