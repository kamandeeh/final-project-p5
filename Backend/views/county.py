from flask import Flask, jsonify, request, Blueprint
from models import db, CountyStatistics
from flask_cors import CORS

county_bp = Blueprint("county_bp", __name__)  
CORS(county_bp)

# Get all county statistics
@county_bp.route('/api/county_statistics', methods=['GET'])
def get_county_statistics():
    counties = CountyStatistics.query.with_entities(
        CountyStatistics.county, CountyStatistics.poverty, 
        CountyStatistics.employment, CountyStatistics.social_integration
    ).all()
    return jsonify([{
        'county': county.county,
        'poverty': county.poverty,
        'employment': county.employment,
        'social_integration': county.social_integration
    } for county in counties]), 200

# Get county statistics by name (case-insensitive)
@county_bp.route('/api/county_statistics/<string:county_name>', methods=['GET'])
def get_county_statistics_by_name(county_name):
    county = CountyStatistics.query.filter(
        CountyStatistics.county.ilike(county_name)
    ).first()
    
    if county:
        return jsonify(county.serialize()), 200
    return jsonify({'error': 'County not found'}), 404

# Add new county statistics
@county_bp.route('/api/county_statistics', methods=['POST'])
def add_county_statistics():
    data = request.get_json()
    required_fields = ['county', 'poverty', 'employment', 'social_integration']
    
    if not data or any(field not in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    county_name = data['county'].strip().lower()
    existing_county = CountyStatistics.query.filter_by(county=county_name).first()

    if existing_county:
        return jsonify({'error': 'County statistics already exist'}), 409

    new_stat = CountyStatistics(
        county=county_name,
        poverty=data['poverty'],
        employment=data['employment'],
        social_integration=data['social_integration']
    )

    db.session.add(new_stat)
    db.session.commit()
    return jsonify(new_stat.serialize()), 201

# Update county statistics (case-insensitive)
@county_bp.route('/api/county_statistics/<string:county_name>', methods=['PUT'])
def update_county_statistics(county_name):
    data = request.get_json()
    county = CountyStatistics.query.filter(
        CountyStatistics.county.ilike(county_name)
    ).first()
    
    if not county:
        return jsonify({'error': 'County not found'}), 404

    county.poverty = data.get('poverty', county.poverty)
    county.employment = data.get('employment', county.employment)
    county.social_integration = data.get('social_integration', county.social_integration)

    db.session.commit()
    return jsonify(county.serialize()), 200

# Delete county statistics (case-insensitive)
@county_bp.route('/api/county_statistics/<string:county_name>', methods=['DELETE'])
def delete_county_statistics(county_name):
    county = CountyStatistics.query.filter(
        CountyStatistics.county.ilike(county_name)
    ).first()

    if not county:
        return jsonify({'error': 'County not found'}), 404

    db.session.delete(county)
    db.session.commit()
    return '', 204  # No Content response

