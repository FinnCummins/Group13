from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
from llm_api import call_open_ai

app = Flask(__name__)

DB_USER = os.getenv("POSTGRES_USER", "myuser")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "mypassword")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_NAME = os.getenv("POSTGRES_DB", "mydatabase")

app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    interests = db.Column(db.ARRAY(db.Text))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Supervisor(db.Model):
    __tablename__ = 'supervisors'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    staff_id = db.Column(db.String(20), unique=True, nullable=False)
    research_interests = db.Column(db.ARRAY(db.Text))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()

@app.route('/')
def hello_world():  # put application's code here
    return call_open_ai()

if __name__ == '__main__':
    app.run()

