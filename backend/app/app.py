from flask import Flask, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail, Message
from authlib.integrations.flask_client import OAuth
import os

# Import blueprints
from user import user_bp
from project import project_bp
from llm import llm_bp
from vector_db import vector_bp
from models import db, Supervisor

app = Flask(__name__)
CORS(app)
mail = Mail(app)

# App configuration
app.config["JWT_SECRET_KEY"] = "super_secret_key_123"
app.config['SECRET_KEY'] = 'my_secret_key'
app.config['SESSION_COOKIE_NAME'] = 'login_session'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://myuser:mypassword@localhost/mydatabase"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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


# Email configuration
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'your-email@example.com'
app.config['MAIL_PASSWORD'] = 'your-password'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail.init_app(app)
jwt = JWTManager(app)
@app.route('/email_supervisor', methods=['POST'])
def email_supervisor():
    
    data = request.get_json()
    student_id = data['student_id']
    supervisor_id = data['supervisor_id']
    message_content = data['message']

    supervisor = Supervisor.query.get(supervisor_id)
    if not supervisor:
        return jsonify({'error': 'Supervisor not found'}), 404

    msg = Message("Message from Student",
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[supervisor.email])
    msg.body = f"Hello {supervisor.first_name},\n\n{message_content}\n\nBest Regards,"
    try:
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully to your supervisor.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(project_bp, url_prefix='/api')
app.register_blueprint(llm_bp, url_prefix='/api')
app.register_blueprint(vector_bp, url_prefix='/api')

def create_app(config_object):
    app = Flask(__name__)
    app.config.from_object(config_object)
    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)

    CORS(app)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def hello():
        return 'Hello, World!'

    return app

if __name__ == '__main__':
    app.run()