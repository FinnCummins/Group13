from flask import Blueprint, request, jsonify
from models import Supervisor, db

supervisor_bp = Blueprint('supervisor', __name__)

@supervisor_bp.route('/supervisors', methods=['GET'])
def get_supervisors():
    supervisors = Supervisor.query.all()
    results = []
    for supervisor in supervisors:
        supervisor_data = {
            "id": supervisor.id,
            "first_name": supervisor.first_name,
            "last_name": supervisor.last_name,
            "email": supervisor.email,
            "staff_id": supervisor.staff_id,
            "research_interests": supervisor.research_interests,
            "created_at": supervisor.created_at.isoformat()
        }
        results.append(supervisor_data)
    return jsonify(results), 200

@supervisor_bp.route('/supervisors', methods=['POST'])
def create_supervisor():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["first_name", "last_name", "email", "staff_id", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    new_supervisor = Supervisor(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        staff_id=data["staff_id"],
        research_interests=data.get("research_interests", [])
    )
    new_supervisor.set_password(data["password"])

    try:
        db.session.add(new_supervisor)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Supervisor created", "supervisor_id": new_supervisor.id}), 201

@supervisor_bp.route('/supervisors/<int:staff_id>', methods=['DELETE'])
def delete_supervisor(staff_id):
    supervisor = Supervisor.query.get(staff_id)
    if not supervisor:
        return jsonify({"error": "Supervisor not found"}), 404

    try:
        db.session.delete(supervisor)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Supervisor deleted"}), 200