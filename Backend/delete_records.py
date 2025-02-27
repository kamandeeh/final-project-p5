from app import db, app
from models import Record

def delete_all_records():
    with app.app_context():
        db.session.query(Record).delete()
        db.session.commit()
        print("✅ All records deleted.")

if __name__ == "__main__":
    delete_all_records()
