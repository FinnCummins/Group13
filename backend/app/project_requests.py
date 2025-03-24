from flask import Blueprint, request, jsonify
from models import db, Project, Student, Supervisor

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

    # Check if request already exists
    existing_request = db.session.execute(
        "SELECT * FROM requests WHERE student_id = :student_id AND project_id = :project_id",
        {"student_id": data["student_id"], "project_id": data["project_id"]}
    ).first()
    if existing_request:
        return jsonify({"error": "Request already exists for this project"}), 400

    try:
        db.session.execute(
            """
            INSERT INTO requests (student_id, supervisor_id, project_id, status)
            VALUES (:student_id, :supervisor_id, :project_id, 'pending')
            """,
            {
                "student_id": data["student_id"],
                "supervisor_id": data["supervisor_id"],
                "project_id": data["project_id"]
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

    query = "SELECT * FROM requests WHERE 1=1"
    params = {}

    if student_id:
        query += " AND student_id = :student_id"
        params["student_id"] = student_id
    if supervisor_id:
        query += " AND supervisor_id = :supervisor_id"
        params["supervisor_id"] = supervisor_id
    if project_id:
        query += " AND project_id = :project_id"
        params["project_id"] = project_id
    if status:
        query += " AND status = :status"
        params["status"] = status

    try:
        requests = db.session.execute(query, params).fetchall()
        results = []
        for req in requests:
            results.append({
                "id": req.id,
                "student_id": req.student_id,
                "supervisor_id": req.supervisor_id,
                "project_id": req.project_id,
                "status": req.status,
                "request_date": req.request_date.isoformat()
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@project_requests_bp.route('/requests/<int:request_id>', methods=['GET'])
def get_request(request_id):
    try:
        request_data = db.session.execute(
            "SELECT * FROM requests WHERE id = :id",
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
            """
            UPDATE requests 
            SET status = :status 
            WHERE id = :id
            RETURNING *
            """,
            {"id": request_id, "status": data["status"]}
        ).first()

        if not result:
            return jsonify({"error": "Request not found"}), 404

        db.session.commit()
        return jsonify({
            "message": "Request updated successfully",
            "id": result.id,
            "status": result.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@project_requests_bp.route('/requests/<int:request_id>', methods=['DELETE'])
def delete_request(request_id):
    try:
        result = db.session.execute(
            "DELETE FROM requests WHERE id = :id RETURNING *",
            {"id": request_id}
        ).first()

        if not result:
            return jsonify({"error": "Request not found"}), 404

        db.session.commit()
        return jsonify({"message": "Request deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
