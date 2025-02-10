from flask import Blueprint, request, jsonify
from models import Student, db

user_bp = Blueprint('user', __name__)

@user_bp.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    results = []
    for student in students:
        student_data = {
            "id": student.id,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "email": student.email,
            "student_id": student.student_id,
            "interests": student.interests,
            "created_at": student.created_at.isoformat()
        }
        results.append(student_data)
    return jsonify(results), 200

@user_bp.route('/students', methods=['POST'])
def create_student():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["first_name", "last_name", "email", "student_id", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    new_student = Student(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        student_id=data["student_id"],
        interests=data.get("interests", [])
    )
    new_student.set_password(data["password"])

    try:
        db.session.add(new_student)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Student created", "student_id": new_student.id}), 201

@user_bp.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    try:
        db.session.delete(student)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Student deleted"}), 200