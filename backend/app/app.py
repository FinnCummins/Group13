from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables
load_dotenv()

# Create the Flask app
app = Flask(__name__)
CORS(app)

# Add these lines
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')  # it's better to use an environment variable
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Optional: set token expiration

# Configure database
if os.getenv('FLY_APP_NAME'):
    DATABASE_URL = os.getenv('DATABASE_URL')
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL.strip('"\'')
else:
    DB_USER = os.getenv("POSTGRES_USER", "myuser")
    DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "mypassword")
    DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
    DB_NAME = os.getenv("POSTGRES_DB", "mydatabase")
    app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

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
