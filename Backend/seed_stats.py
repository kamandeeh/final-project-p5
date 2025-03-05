import random
from .models import db, Record, CountyStatistics
from .app import app  # Ensure this imports your Flask app

# Define a function to seed the database
def seed_county_statistics():
    with app.app_context():  # Ensure we have an app context
        counties = Record.query.all()  # Fetch all counties

        if not counties:
            print("⚠️ No counties found! Please seed the 'counties' table first.")
            return

        for county in counties:
            # Check if statistics for this county already exist
            existing_stat = CountyStatistics.query.filter_by(county_id=county.id).first()
            if existing_stat:
                print(f"🔹 Statistics already exist for {county.name}, skipping...")
                continue

            # Generate random statistics
            poverty = random.randint(10, 80)  # % of people below the poverty line
            employment = random.randint(20, 90)  # % of employed individuals
            social_integration = random.randint(30, 100)  # Social integration score

            # Create and insert new record
            new_stat = CountyStatistics(
                county_id=county.id,
                poverty=poverty,
                employment=employment,
                social_integration=social_integration
            )
            db.session.add(new_stat)
            print(f"✅ Added statistics for {county.county}: Poverty {poverty}%, Employment {employment}%, Social Integration {social_integration}%")



        # Commit changes to the database
        db.session.commit()
        print("🎉 Seeding completed successfully!")

# Run the seed function
if __name__ == "__main__":
    seed_county_statistics()
