from models import db, Record
from flask import jsonify, request, Blueprint, current_app
from flask_cors import CORS

record_bp = Blueprint("record_bp", __name__)
CORS(record_bp, resources={r"/*": {"origins": "http://localhost:5173"}})


@record_bp.route("/records", methods=["GET"])
def get_records():
    try:
        records = Record.query.all()
        records_list = []
        for record in records:
            record_data = {
                'id': record.id,
                'county': record.county, 
                'description': record.description,
                'category': record.category,
                'created_at': record.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'updated_at': record.updated_at.strftime('%Y-%m-%d %H:%M:%S') if record.updated_at else None
            }
            records_list.append(record_data)  # ✅ Fixed
        return jsonify(records_list), 200
    except Exception as e:
        current_app.logger.error(f"Error: {str(e)}")  
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

@record_bp.route("/record/<int:id>", methods=['PUT'])
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
        record_bp.logger.error(f"Error: {str(e)}") 
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
    
@record_bp.route("/record", methods=['POST'])
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
        record_bp.logger.error(f"Error: {str(e)}") 
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500


@record_bp.route("/search", methods=["GET"])
def search_counties():
    query = request.args.get("query", "").lower()
    if not query:
        return jsonify([])  # Return empty list if no query

    results = Record.query.filter(
        (Record.county.ilike(f"%{query}%")) | (Record.category.ilike(f"%{query}%"))
    ).all()

    return jsonify([{"county": c.county, "category": c.category} for c in results])