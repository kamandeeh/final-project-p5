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

# Number of records per county
RECORDS_PER_COUNTY = 3  

def seed_records():
    with app.app_context():
        print("🌱 Seeding records...")

        for county in counties:
            for _ in range(RECORDS_PER_COUNTY):  # Loop to create multiple records
                record = Record(
                    county=county,
                    category=random.choice(categories),
                    created_at=datetime.utcnow()
                )
                db.session.add(record)

        db.session.commit()
        print(f"✅ Successfully seeded {len(counties) * RECORDS_PER_COUNTY} records.")

if __name__ == "__main__":
    seed_records()
