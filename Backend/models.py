from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime

# Initialize extensions
metadata = MetaData()

db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean,default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    profile = db.relationship('Profile', backref='user', uselist=False, cascade='all, delete')
    
class Profile(db.Model):
    __tablename__ = 'profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    location = db.Column(db.String(100))
    social_background = db.Column(db.String(200))
    phone_number=db.Column(db.String(10))
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

class Record(db.Model):
    __tablename__ = 'records'
    
    id = db.Column(db.Integer, primary_key=True)
    county = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    

    def serialize(self):
        return {
            'id': self.id,
            'county': self.county,
            'description': self.description,
            'category': self.category,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)

