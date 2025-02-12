from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    college_id = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    interests = db.Column(db.ARRAY(db.Text))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """Hashes and sets the user's password"""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """Verifies the given password against the stored hash"""
        return check_password_hash(self.password, password)

class Student(User):
    __tablename__ = 'students'
    __mapper_args__ = {
        'concrete': True  # using concrete table inheritance
    }

class Supervisor(User):
    __tablename__ = 'supervisors'
    __mapper_args__ = {
        'concrete': True
    }

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    project_title = db.Column(db.String(100), nullable=False)
    project_description = db.Column(db.String(2000), nullable=False)
    keywords = db.Column(db.ARRAY(db.Text))
    supervisor_id = db.Column(db.Integer, db.ForeignKey('supervisors.id', ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    supervisor = db.relationship('Supervisor', backref=db.backref('projects', lazy=True, cascade="all, delete-orphan"))
