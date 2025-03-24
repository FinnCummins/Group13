from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS 
import os
from user import user_bp
from project import project_bp
from llm import llm_bp
from vector_db import vector_bp
from models import db
from project_requests import project_requests_bp

app = Flask(__name__)

CORS(app)

app.config["JWT_SECRET_KEY"] = "super_secret_key_123"

jwt = JWTManager(app)

DB_USER = os.getenv("POSTGRES_USER", "myuser")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "mypassword")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_NAME = os.getenv("POSTGRES_DB", "mydatabase")
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def hello_world():
    return "This application will help guide final year computer science students find and select their capstone project"

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(project_bp, url_prefix='/api')
app.register_blueprint(llm_bp, url_prefix='/api')
app.register_blueprint(vector_bp, url_prefix='/api')
app.register_blueprint(project_requests_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run()
