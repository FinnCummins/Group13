from flask import Blueprint, request, jsonify
from models import db, Project, Student, Supervisor
from sqlalchemy import text
from project import update_project_data

project_requests_bp = Blueprint('project_requests', __name__)


@project_requests_bp.route('/requests', methods=['POST'])
def create_request():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["student_id", "supervisor_id", "project_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    return make_request(data["student_id"], data["supervisor_id"], data["project_id"], data.get("student_request_text", "the student has not added a message"))


@project_requests_bp.route('/requests/<int:student_id>/<int:project_id>', methods=['POST'])
def request_project(student_id, project_id):
    data = request.get_json()
    return make_request(student_id, Project.query.get(project_id).supervisor_id, project_id, data.get("student_request_text", "the student has not added a message"))

def make_request(student_id, supervisor_id, project_id, student_request_text = ""):

    # Verify that the student, supervisor, and project exist
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    supervisor = Supervisor.query.get(supervisor_id)
    if not supervisor:
        return jsonify({"error": "Supervisor not found"}), 404

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    if project.supervisor_id != supervisor.id:
        return jsonify({"error": "Supervisor does not match project's supervisor"}), 400

    if project.project_status == "taken":
        return jsonify({"error": "Project already taken"}), 400

    existing_request = db.session.execute(
        text("SELECT * FROM requests WHERE student_id = :student_id AND project_id = :project_id"),
        {"student_id": student_id, "project_id": project_id}
    ).first()
    if existing_request:
        return jsonify({"error": "Request already exists for this project"}), 400

    try:
        db.session.execute(
            text("""
            INSERT INTO requests (student_id, supervisor_id, project_id, status, student_request_text)
            VALUES (:student_id, :supervisor_id, :project_id, 'pending', :student_request_text)
            """),
            {
                "student_id": student_id,
                "supervisor_id": supervisor_id,
                "project_id": project_id,
                "student_request_text": student_request_text
            }
        )
        db.session.commit()
        return jsonify({"message": "Request created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@project_requests_bp.route('/requests', methods=['GET'])
def get_requests():
    student_id = request.args.get('student_id', type=int)
    supervisor_id = request.args.get('supervisor_id', type=int)
    project_id = request.args.get('project_id', type=int)
    status = request.args.get('status')
    student_request_text = request.args.get('student_request_text')
    supervisor_response_text = request.args.get('supervisor_response_text')

    base_query = "SELECT * FROM requests WHERE 1=1"
    conditions = []
    params = {}

    if student_id:
        conditions.append("student_id = :student_id")
        params["student_id"] = student_id
    if supervisor_id:
        conditions.append("supervisor_id = :supervisor_id")
        params["supervisor_id"] = supervisor_id
    if project_id:
        conditions.append("project_id = :project_id")
        params["project_id"] = project_id
    if status:
        conditions.append("status = :status")
        params["status"] = status
    if student_request_text:
        conditions.append("student_request_text = :student_request_text")
        params["student_request_text"] = student_request_text
    if supervisor_response_text:
        conditions.append("supervisor_response_text = :supervisor_response_text")
        params["supervisor_response_text"] = supervisor_response_text

    if conditions:
        base_query += " AND " + " AND ".join(conditions)

    try:
        requests = db.session.execute(text(base_query), params).fetchall()
        results = []
        for req in requests:
            results.append({
                "id": req.id,
                "student_id": req.student_id,
                "supervisor_id": req.supervisor_id,
                "project_id": req.project_id,
                "status": req.status,
                "student_request_text": req.student_request_text,
                "supervisor_response_text": req.supervisor_response_text,
                "request_date": req.request_date.isoformat()
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_requests_bp.route('/requests/<int:request_id>', methods=['GET'])
def get_request(request_id):
    try:
        request_data = db.session.execute(
            text("""
            SELECT * FROM requests WHERE id = :id
            """),
            {"id": request_id}
        ).first()

        if not request_data:
            return jsonify({"error": "Request not found"}), 404

        return jsonify({
            "id": request_data.id,
            "student_id": request_data.student_id,
            "supervisor_id": request_data.supervisor_id,
            "project_id": request_data.project_id,
            "status": request_data.status,
            "student_request_text": request_data.student_request_text,
            "supervisor_response_text": request_data.supervisor_response_text,
            "request_date": request_data.request_date.isoformat()
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_requests_bp.route('/requests/<int:request_id>', methods=['PUT'])
def update_request(request_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    if "status" not in data:
        return jsonify({"error": "Status is required"}), 400

    valid_statuses = ["pending", "accepted", "rejected"]
    if data["status"] not in valid_statuses:
        return jsonify({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400

    try:
        result = db.session.execute(
            text("""
                UPDATE requests 
                SET status = :status 
                WHERE id = :id
                RETURNING *
                """),
            {"id": request_id, "status": data["status"]}
        ).first()

        if not result:
            return jsonify({"error": "Request not found"}), 404

        #update project status
        if data["status"] == "accepted":
            update_project_response, response_status = update_project_data(result.project_id, {"project_status": "taken"})
            if response_status != 200:
                return update_project_response, response_status

        db.session.commit()
        return jsonify({
            "message": "Request updated successfully",
            "id": result.id,
            "status": result.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@project_requests_bp.route('/supervisor_requests/<int:supervisor_id>', methods=['GET'])
def get_supervisor_requests(supervisor_id):
    return get_user_requests(supervisor_id, Supervisor, "supervisor")


@project_requests_bp.route('/student_requests/<int:student_id>', methods=['GET'])
def get_student_requests(student_id):
    return get_user_requests(student_id, Student, "student")


def get_user_requests(user_id, user_model, user_type):
    try:
        user = user_model.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if user_type == "supervisor":
            requests = db.session.execute(
                text("""
                    SELECT id, student_id, project_id, status
                    FROM requests
                    WHERE supervisor_id = :supervisor_id
                    """),
                {"supervisor_id": user_id}
            ).fetchall()
        elif user_type == "student":
            requests = db.session.execute(
                text("""
                    SELECT id, supervisor_id, project_id, status
                    FROM requests
                    WHERE student_id = :student_id
                    """),
                {"student_id": user_id}
            ).fetchall()

        results = []
        for req in requests:
            project_data = Project.query.get(req.project_id)
            if user_type == "supervisor":
                other_user_type = "student"
                other_user_data = Student.query.get(req.student_id)
            else:
                other_user_type = "supervisor"
                other_user_data = Supervisor.query.get(req.supervisor_id)

            results.append({
                "request_id": req.id,
                "status": req.status,
                other_user_type: {
                    "id": other_user_data.id,
                    "first_name": other_user_data.first_name,
                    "last_name": other_user_data.last_name,
                    "email": other_user_data.email
                },
                "project": {
                    "id": project_data.id,
                    "project_status": project_data.project_status,
                    "project_title": project_data.project_title,
                    "supervisor_id": project_data.supervisor_id
                }
            })


        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@project_requests_bp.route('/requests/<int:request_id>', methods=['DELETE'])
def delete_request(request_id):
    try:
        result = db.session.execute(
            text("""
            DELETE FROM requests WHERE id = :id RETURNING *
            """),
            {"id": request_id}
        ).first()

        if not result:
            return jsonify({"error": "Request not found"}), 404

        db.session.commit()
        return jsonify({"message": "Request deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
