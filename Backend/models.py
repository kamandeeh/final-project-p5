from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime

# Initialize extensions
metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True) 
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    provider = db.Column(db.String(50), default="email")
    
    profile = db.relationship('Profile', backref='user', uselist=False, cascade='all, delete')

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_admin": self.is_admin,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            "provider": self.provider
        }

class Profile(db.Model):
    __tablename__ = 'profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    location = db.Column(db.String(100))
    social_background = db.Column(db.String(200))
    phone_number = db.Column(db.String(10))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)

    def __repr__(self):
        return f'<Profile {self.full_name}>'

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "age": self.age,
            "gender": self.gender,
            "location": self.location,
            "social_background": self.social_background,
            "user_id": self.user_id
        }

class Record(db.Model):  # Renamed from County to avoid conflict
    __tablename__ = 'counties'
    
    id = db.Column(db.Integer, primary_key=True)
    county = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def serialize(self):
        return {
            'id': self.id,
            'county': self.county,
            'category': self.category,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class CountyStatistics(db.Model):
    __tablename__ = 'county_statistics'  # Fixed table name

    id = db.Column(db.Integer, primary_key=True)
    county_id = db.Column(db.Integer, db.ForeignKey('counties.id'), nullable=False)  # Fixed FK
    poverty = db.Column(db.Integer, nullable=False)
    employment = db.Column(db.Integer, nullable=False)
    social_integration = db.Column(db.Integer, nullable=False)

    county = db.relationship('Record', backref=db.backref('statistics', uselist=False, cascade="all, delete"))  # Fixed reference

    def serialize(self):
        return {
            'id': self.id,
            'county_id': self.county_id,
            'poverty': self.poverty,
            'employment': self.employment,
            'social_integration': self.social_integration
        }

class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)
