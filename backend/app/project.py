from flask import Blueprint, request, jsonify
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import ARRAY, TEXT

from vector_db import upsert_vector, query_vectors
from llm import generate_project_embedding
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
        project_status=data.get("project_status", "No status"),
        supervisor_id=data["supervisor_id"],
    )

    try:
        db.session.add(new_project)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    response, status = vectorize_project(new_project)
    if status != 200:
        return jsonify({response.get_data(as_text=True)}), status

    return jsonify({"message": "Project created", "project_id": new_project.id}), 200


@project_bp.route('/projects', methods=['GET'])
def get_projects():
    supervisor_ids = request.args.getlist('supervisor_ids', type=int)
    keywords = request.args.getlist('keywords', type=str)
    project_status = request.args.get('project_status', None)

    query = Project.query

    if supervisor_ids:
        query = query.filter(Project.supervisor_id.in_(supervisor_ids))

    if keywords:
        query = query.filter(Project.keywords.op("&&")(cast(keywords, ARRAY(TEXT))))

    if project_status:
        query = query.filter(Project.project_status == project_status)

    projects = query.all()

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


@project_bp.route('/search_vectorized_projects', methods=['POST'])
def search_vectorized_projects():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    if "message" not in data:
        return jsonify({"error": f"Missing field: message"}), 400

    project_status = data.get("project_status", None)
    interests = data.get("interests", ["unknown"])
    top_k = data.get("top_k", 5)

    # TODO: Associate interests with user session
    text = "interests: " + ", ".join(interests) + "; " + data["message"]

    # TODO: fix mess of namespaces
    query_params = {"namespace": "projects",
                    "top_k": top_k,
                    "include_values": False,
                    "include_metadata": True,
                    "text": text
                    }

    if project_status:
        query_params["filter"] = {"project_status": project_status}

    vector_response, vector_status = query_vectors(query_params)

    if vector_status != 200:
        return jsonify({vector_response.get_data(as_text=True)}), vector_status

    matches = vector_response.get_json().get("matches", [])

    project_matches = []
    for match in matches:
        project_id = match.get("id")
        score = match.get("score")

        try:
            project = Project.query.get(int(project_id))
        except Exception:
            project = None
        if project:
            project_matches.append({
                "id": project.id,
                "project_title": project.project_title,
                "project_description": project.project_description,
                "keywords": project.keywords,
                "project_status": project.project_status,
                "match_score": score
            })

    return jsonify({"matches": project_matches}), 200


# should only be called when database is initialized with projects
@project_bp.route('/vectorize_projects', methods=['POST'])
def vectorize_projects():
    projects = Project.query.all()

    failed_projects = []

    for project in projects:
        response, status = vectorize_project(project)
        if status != 200:
            failed_projects.append(project.id)

    if not failed_projects:
        return jsonify({"message": "All projects added to vector database"}), 200
    else:
        return jsonify({"message": "failed to add projects: " + ", ".join(failed_projects) +
                                   "\nAll other projects added to vector database"}), 200


# TODO: update vector database
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


def vectorize_project(project):
    project_data = {
        "id": project.id,
        "project_title": project.project_title,
        "project_description": project.project_description,
        "keywords": project.keywords,
        "project_status": project.project_status,
    }

    try:
        embedding_response, embedding_status = generate_project_embedding(project_data)
        if embedding_status != 200:
            return jsonify({"error inserting project embedding into vector database": embedding_response.get_data(
                as_text=True)}), embedding_status
        upsert_response, upsert_status = upsert_vector(embedding_response.get_json())
        if upsert_status != 200:
            return jsonify({"error inserting project embedding into vector database": upsert_response.get_data(
                as_text=True)}), upsert_status
        return jsonify({"message": "Project added to vector database", "project_id": project.id}), 200
    except Exception as e:
        return jsonify({"error inserting project embedding into vector database": str(e)}), 500
