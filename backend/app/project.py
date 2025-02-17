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
        project_status = data.get("project_status", "No status"),
        supervisor_id=data["supervisor_id"],
    )

    try:
        db.session.add(new_project)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Project created", "project_id": new_project.id})

@project_bp.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    results = []
    for project in projects:
        project_data = {
            "id": project.id,
            "project_title": project.project_title,
            "project_description": project.project_description,
            "keywords": project.keywords,
            "project_status": project.project_status,
            "supervisor_id": project.supervisor_id
        }
        results.append(project_data)
    return jsonify(results), 200

@project_bp.route('/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    data = request.get_json()
    if 'project_title' in data:
        project.project_title = data['project_title']
    if 'project_description' in data:
        project.project_description = data['project_description']
    if 'keywords' in data:
        project.keywords = data['keywords']
    if 'project_status' in data:
        project.project_status = data['project_status']
    
    try:
        db.session.commit()
        return jsonify({'message': 'Project updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@project_bp.route('/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404

    try:
        db.session.delete(project)
        db.session.commit()
        return jsonify({'message': 'Project deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
