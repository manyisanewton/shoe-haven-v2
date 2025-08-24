import json
from app import create_app
from app.extensions import db
from app.models import Shoe

def populate_database():
    app = create_app()
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()

        print("Loading shoe data from db.json...")
        with open('db.json') as f:
            data = json.load(f)
            shoes_data = data['shoes']

        for shoe_data in shoes_data:
            # Convert sizes list to a comma-separated string
            sizes_str = ",".join(map(str, shoe_data['sizes']))
            
            shoe = Shoe(
                id=shoe_data['id'],
                name=shoe_data['name'],
                brand=shoe_data['brand'],
                description=shoe_data['description'],
                price=shoe_data['price'],
                details=shoe_data['details'],
                sizes=sizes_str,
                image=shoe_data['image'],
                rating=shoe_data['rating'],
                stock=shoe_data['stock']
            )
            db.session.add(shoe)
        
        print("Committing shoe data to the database...")
        db.session.commit()
        print("Database populated successfully!")

if __name__ == '__main__':
    populate_database()