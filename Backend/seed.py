from datetime import datetime
from app import db, app
from models import Record
import random

# List of 47 counties in Kenya
counties = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", "Garissa",
    "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu",
    "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
    "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
    "Elgeyo Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
    "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
    "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
]

# Categories of poverty/employment status
categories = ["Extreme Poverty", "Moderate Poverty", "Employed", "Unemployed", "Underemployed"]

def seed_records():
    with app.app_context():
        print("🌱 Seeding records...")

        for county in counties:
            record = Record(
                county=county,
                category=random.choice(categories),  # Assign a random category
                created_at=datetime.utcnow()
            )
            db.session.add(record)

        db.session.commit()
        print(f"✅ Successfully seeded {len(counties)} unique records (one per county).")

if __name__ == "__main__":
    seed_records()
