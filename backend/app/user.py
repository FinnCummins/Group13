from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models import Student, db, Supervisor

user_bp = Blueprint('user', __name__)


def get_users(model):
    users = model.query.all()
    results = []
    for user in users:
        user_data = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "interests": user.interests,
            "created_at": user.created_at.isoformat()
        }
        results.append(user_data)
    return jsonify(results), 200


def get_user_by_id(model, id):
    user = model.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "interests": user.interests,
        "created_at": user.created_at.isoformat()
    }

    return jsonify(user_data), 200


def create_user(model, data):
    required_fields = ["first_name", "last_name", "email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    new_user = model(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        interests=data.get("interests", [])
    )
    new_user.set_password(data["password"])

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return None, jsonify({"error": str(e)}), 500

    return new_user, None, None


def delete_user(model, id):
    user = model.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": f"{model.__name__} deleted"}), 200


def login_user(model, email, password):
    user = model.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "interests": user.interests
    }), 200


def get_user_interests(model, id):
    user = model.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return user.interests, 200


def add_user_interests(model, id, data):
    user = model.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if "interests" not in data:
        return jsonify({"error": f"Missing field: interests"}), 400

    new_interests = list(set(user.interests) | set(data["interests"]))

    user.interests = new_interests

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return new_interests, 200


def remove_user_interests(model, id, data):
    user = model.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if "interests" not in data:
        return jsonify({"error": f"Missing field: interests"}), 400

    new_interests = list(set(user.interests) - set(data["interests"]))

    user.interests = new_interests

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return new_interests, 200


# -----------------------
# Student Endpoints
# -----------------------

@user_bp.route('/students', methods=['GET'])
def get_students():
    return get_users(Student)


@user_bp.route('/students/<int:id>', methods=['GET'])
def get_student_by_id(id):
    return get_user_by_id(Student, id)


@user_bp.route('/students', methods=['POST'])
def create_student():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    new_student, error_response, error_status = create_user(Student, data)
    if error_response:
        return error_response, error_status

    return jsonify({"message": "Student created", "id": new_student.id}), 200


@user_bp.route('/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    return delete_user(Student, id)


@user_bp.route('/students/login', methods=['POST'])
def login_student():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400

    return login_user(Student, data['email'], data['password'])


@user_bp.route('/students/interests/<int:id>', methods=['GET'])
def get_student_interests(id):
    return get_user_interests(Student, id)


@user_bp.route('/students/add_interests/<int:id>', methods=['PATCH'])
def add_student_interests(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    return add_user_interests(Student, id, data)


@user_bp.route('/students/remove_interests/<int:id>', methods=['PATCH'])
def remove_student_interests(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    return remove_user_interests(Student, id, data)


# -----------------------
# Supervisor Endpoints
# -----------------------

@user_bp.route('/supervisors', methods=['GET'])
def get_supervisors():
    return get_users(Supervisor)


@user_bp.route('/supervisors/<int:id>', methods=['GET'])
def get_supervisor_by_id(id):
    return get_user_by_id(Supervisor, id)


@user_bp.route('/supervisors', methods=['POST'])
def create_supervisor():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    new_supervisor, error_response, error_status = create_user(Supervisor, data)
    if error_response:
        return error_response, error_status

    return jsonify({"message": "Supervisor created", "id": new_supervisor.id}), 200


@user_bp.route('/supervisors/<int:id>', methods=['DELETE'])
def delete_supervisor(id):
    return delete_user(Supervisor, id)


@user_bp.route('/supervisors/login', methods=['POST'])
def login_supervisor():
    data = request.get_json()

    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400

    return login_user(Supervisor, data['email'], data['password'])

@user_bp.route('/supervisors/interests/<int:id>', methods=['GET'])
def get_supervisor_interests(id):
    return get_user_interests(Supervisor, id)


@user_bp.route('/supervisors/add_interests/<int:id>', methods=['PATCH'])
def add_supervisor_interests(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    return add_user_interests(Supervisor, id, data)


@user_bp.route('/supervisors/remove_interests/<int:id>', methods=['PATCH'])
def remove_supervisor_interests(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    return remove_user_interests(Supervisor, id, data)