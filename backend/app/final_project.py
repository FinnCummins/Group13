from flask import Blueprint, request, jsonify
from app.models import db, FinalProject, Project, Student, Supervisor

final_project_bp = Blueprint('final_project', __name__)

@final_project_bp.route('/final_project', methods=['POST'])
def create_final_project():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["student_id", "project_id", "supervisor_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Verify that the student, supervisor, and project exist
    student = Student.query.get(data["student_id"])
    if not student:
        return jsonify({"error": "Student not found"}), 404

    supervisor = Supervisor.query.get(data["supervisor_id"])
    if not supervisor:
        return jsonify({"error": "Supervisor not found"}), 404

    project = Project.query.get(data["project_id"])
    if not project:
        return jsonify({"error": "Project not found"}), 404

    # Check if project is already assigned
    existing_assignment = FinalProject.query.filter_by(project_id=data["project_id"]).first()
    if existing_assignment:
        return jsonify({"error": "Project is already assigned"}), 400

    # Check if student already has a final project
    existing_student_project = FinalProject.query.filter_by(student_id=data["student_id"]).first()
    if existing_student_project:
        return jsonify({"error": "Student already has a final project assigned"}), 400

    # Create new final project assignment
    new_final_project = FinalProject(
        student_id=data["student_id"],
        project_id=data["project_id"],
        supervisor_id=data["supervisor_id"]
    )

    try:
        # Update project status to taken
        project.project_status = "taken"
        
        db.session.add(new_final_project)
        db.session.commit()
        return jsonify({"message": "Final project assigned successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@final_project_bp.route('/final_project', methods=['GET'])
def get_final_projects():
    student_id = request.args.get('student_id', type=int)
    supervisor_id = request.args.get('supervisor_id', type=int)
    project_id = request.args.get('project_id', type=int)

    query = FinalProject.query

    if student_id:
        query = query.filter_by(student_id=student_id)
    if supervisor_id:
        query = query.filter_by(supervisor_id=supervisor_id)
    if project_id:
        query = query.filter_by(project_id=project_id)

    final_projects = query.all()
    results = []

    for fp in final_projects:
        project = Project.query.get(fp.project_id)
        student = Student.query.get(fp.student_id)
        supervisor = Supervisor.query.get(fp.supervisor_id)

        results.append({
            "id": fp.id,
            "student": {
                "id": student.id,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "email": student.email
            },
            "project": {
                "id": project.id,
                "project_title": project.project_title,
                "project_description": project.project_description,
                "project_status": project.project_status
            },
            "supervisor": {
                "id": supervisor.id,
                "first_name": supervisor.first_name,
                "last_name": supervisor.last_name,
                "email": supervisor.email
            },
            "locked_at": fp.locked_at.isoformat()
        })

    return jsonify(results), 200 