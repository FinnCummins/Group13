from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from user import user_bp
from models import db, Student, Supervisor
from llm_api import call_open_ai

app = Flask(__name__)

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
def hello_world():  # put application's code here
    return "hello world"  #call_open_ai()


app.register_blueprint(user_bp, url_prefix='/user')


if __name__ == '__main__':
    app.run()
