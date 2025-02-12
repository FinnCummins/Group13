from flask import Blueprint, request, jsonify
from models import Student, db, Supervisor

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
            "college_id": user.college_id,
            "interests": user.interests,
            "created_at": user.created_at.isoformat()
        }
        results.append(user_data)
    return jsonify(results), 200


def create_user(model, data):
    required_fields = ["first_name", "last_name", "email", "college_id", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    new_user = model(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        college_id=data["college_id"],
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

# -----------------------
# Student Endpoints
# -----------------------

@user_bp.route('/students', methods=['GET'])
def get_students():
    return get_users(Student)

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

# -----------------------
# Supervisor Endpoints
# -----------------------

@user_bp.route('/supervisors', methods=['GET'])
def get_supervisors():
    return get_users(Supervisor)

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
