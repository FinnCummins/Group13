from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Create the Flask app
app = Flask(__name__)
CORS(app)

# Configure database
if os.getenv('FLY_APP_NAME'):
    DATABASE_URL = os.getenv('DATABASE_URL')
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL.strip('"\'')
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/postgres'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Import routes AFTER db initialization
from app.user import user_bp
from app.project import project_bp
from app.llm import llm_bp
from app.vector_db import vector_bp
from app.project_requests import project_requests_bp

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(project_bp, url_prefix='/api')
app.register_blueprint(llm_bp, url_prefix='/api')
app.register_blueprint(vector_bp, url_prefix='/api')
app.register_blueprint(project_requests_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
