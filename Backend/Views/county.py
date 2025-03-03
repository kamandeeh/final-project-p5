from flask import Blueprint, request, jsonify, current_app
from models import db, CountyStatistics, User, Record
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

county_stats_bp = Blueprint("county_stats_bp", __name__)
CORS(county_stats_bp, resources={r"/*": {"origins": "http://localhost:5173"}})

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

# Get statistics for a county
@county_stats_bp.route('/county_statistics', methods=['GET'])
def get_county_statistics():
    county_name = request.args.get('county', '').strip().lower()
    county = Record.query.filter(Record.county.ilike(county_name)).first()

    if not county:
        return jsonify([]), 404  

    stats = CountyStatistics.query.filter_by(county_id=county.id).first()
    return jsonify([stats.serialize()]) if stats else jsonify([])

# Create or update county statistics (Admin only)
@county_stats_bp.route("/county_statistics", methods=['POST'])
@admin_required
def create_or_update_statistics():
    try:
        data = request.get_json()
        required_fields = ['county_id', 'poverty', 'employment', 'social_integration']
        for field in required_fields:
            if field not in data or data[field] is None:
                return jsonify({"error": f"'{field}' is required"}), 400

        stats = CountyStatistics.query.filter_by(county_id=data['county_id']).first()
        if stats:
            stats.poverty = data['poverty']
            stats.employment = data['employment']
            stats.social_integration = data['social_integration']
        else:
            stats = CountyStatistics(
                county_id=data['county_id'],
                poverty=data['poverty'],
                employment=data['employment'],
                social_integration=data['social_integration']
            )
            db.session.add(stats)

        db.session.commit()
        return jsonify({"message": "County statistics saved successfully", "statistics": stats.serialize()}), 200
    except Exception as e:
        current_app.logger.error(f"Error: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
