from flask import Blueprint, request, jsonify, current_app
from models import db, CountyStatistics, User, Record
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity

county_stats_bp = Blueprint("county_stats_bp", __name__)
CORS(county_stats_bp)

# Fetch county statistics by county_id or name
@county_stats_bp.route('/county_statistics/<county_identifier>', methods=['GET'])
def get_county_statistics(county_identifier):
    try:
        if county_identifier.isdigit():
            stats = CountyStatistics.query.filter_by(county_id=int(county_identifier)).all()
        else:
            record = Record.query.filter_by(county=county_identifier).first()
            if not record:
                return jsonify({"error": "County not found"}), 404
            stats = CountyStatistics.query.filter_by(county_id=record.id).all()

        if not stats:
            return jsonify({"message": "No statistics found for this county"}), 404

        results = [{
            "county_id": stat.county_id,
            "poverty": stat.poverty,
            "employment": stat.employment,
            "social_integration": stat.social_integration
        } for stat in stats]

        return jsonify(results), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching statistics: {str(e)}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# Create county statistics (Previously admin-only, now open)
@county_stats_bp.route("/county_statistics", methods=['POST'])
def create_statistics():
    try:
        data = request.get_json()
        required_fields = ['county_id', 'poverty', 'employment', 'social_integration']
        
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        stats = CountyStatistics(**data)
        db.session.add(stats)
        db.session.commit()

        return jsonify({"message": "County statistics created successfully", "statistics": {
            "county_id": stats.county_id,
            "poverty": stats.poverty,
            "employment": stats.employment,
            "social_integration": stats.social_integration
        }}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating county statistics: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Update county statistics
@county_stats_bp.route("/county_statistics/<int:county_id>", methods=['PUT'])
def update_statistics(county_id):
    try:
        data = request.get_json()
        required_fields = ['poverty', 'employment', 'social_integration']
        
        missing_fields = [field for field in required_fields if field not in data or data[field] is None]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        stats = CountyStatistics.query.filter_by(county_id=county_id).first()

        if not stats:
            return jsonify({"error": "County statistics not found"}), 404

        stats.poverty = data['poverty']
        stats.employment = data['employment']
        stats.social_integration = data['social_integration']

        db.session.commit()

        return jsonify({"message": "County statistics updated successfully", "statistics": {
            "county_id": stats.county_id,
            "poverty": stats.poverty,
            "employment": stats.employment,
            "social_integration": stats.social_integration
        }}), 200
    except Exception as e:
        current_app.logger.error(f"Error updating county statistics: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500

# Fetch all county statistics
@county_stats_bp.route("/county_statistics", methods=["GET"])
def get_all_county_statistics():
    try:
        stats = CountyStatistics.query.all()

        if not stats:
            return jsonify({"message": "No statistics found"}), 404

        results = [{
            "county_id": stat.county_id,
            "poverty": stat.poverty,
            "employment": stat.employment,
            "social_integration": stat.social_integration
        } for stat in stats]

        return jsonify(results), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching statistics: {str(e)}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

# Delete county statistics
@county_stats_bp.route("/county_statistics/<int:county_id>", methods=['DELETE'])
def delete_statistics(county_id):
    try:
        stats = CountyStatistics.query.filter_by(county_id=county_id).first()
        
        if not stats:
            return jsonify({"error": "County statistics not found"}), 404
        
        db.session.delete(stats)
        db.session.commit()
        
        return jsonify({"message": "County statistics deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting county statistics: {str(e)}")
        return jsonify({'error': 'Internal Server Error', 'details': str(e)}), 500
