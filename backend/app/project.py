from flask import Blueprint, request, jsonify
from models import Project, db

project_bp = Blueprint('project', __name__)

@project_bp.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["project_title", "project_description", "supervisor_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    new_project = Project(
        project_title=data["project_title"],
        project_description=data["project_description"],
        keywords=data.get("keywords", []),
        supervisor_id=data["supervisor_id"],
    )

    try:
        db.session.add(new_project)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Project created", "project_id": new_project.id}), 201
