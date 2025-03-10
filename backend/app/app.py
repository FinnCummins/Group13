from flask import Flask, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
import os
from user import user_bp
from project import project_bp
from llm import llm_bp
from models import db

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super_secret_key_123"
app.config['SECRET_KEY'] = 'my_secret_key'  # Needed for session management
app.config['SESSION_COOKIE_NAME'] = 'login_session'

jwt = JWTManager(app)

# Database configuration
DB_USER = os.getenv("POSTGRES_USER", "myuser")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "mypassword")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_NAME = os.getenv("POSTGRES_DB", "mydatabase")
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
oauth = OAuth(app)

# Configuration for Microsoft OAuth
oauth.register(
    'microsoft',
    client_id='client_id',
    client_secret='client_secret',
    access_token_url='https://login.microsoftonline.com/common/oauth2/v2.0/token',
    access_token_params=None,
    authorize_url='https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    authorize_params=None,
    api_base_url='https://graph.microsoft.com/v1.0/',
    client_kwargs={'scope': 'User.Read'},
)

with app.app_context():
    db.create_all()
    
    
@app.route('/')
def hello_world():
    return "This application will help guide final year computer science students find and select their capstone project"

@app.route('/login/microsoft')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return oauth.microsoft.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    token = oauth.microsoft.authorize_access_token()
    resp = oauth.microsoft.get('me')
    profile = resp.json()
    # we can handle user data here as per our application's needs
    return jsonify(profile)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(project_bp, url_prefix='/api')
app.register_blueprint(llm_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run()
