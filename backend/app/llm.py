from flask import Blueprint, request, jsonify, Response
from models import ChatbotHistory, db
from user import get_user_interests
#from project import get_projects
from models import Student
from open_ai import get_embedding, call_open_ai

llm_bp = Blueprint('llm', __name__)


@llm_bp.route('/llm', methods=['POST'])
def chat_with_llm():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    if "message" not in data:
        return jsonify({"error": f"Missing field: message"}), 400
    message = "\n#USER MESSAGE#" + data["message"]

    if "user_id" not in data:
        return jsonify({"error": f"Missing field: user_id"}), 400
    user_id = data["user_id"]

    chat_context = ChatbotHistory.query.filter_by(user_id=user_id).first()

    if not chat_context:
        initial_context = f"{message} \n\n#INITIAL PROMPT#" + initial_prompt(user_id)

        chat_context = ChatbotHistory(user_id=user_id, context=initial_context)
        db.session.add(chat_context)
        db.session.commit()
    else:
        chat_context.context = f"{message} \n\n#PREVIOUS MESSAGE (IGNORE UNLESS CONTEXT NEEDED)# " + chat_context.context
        db.session.commit()

    try:
        response = call_open_ai(chat_context.context)
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return jsonify({"error": str(e)}), 500

    chat_context.context = "\n#CHATBOT RESPONSE#" + response + chat_context.context
    db.session.commit()

    return jsonify({"response": response}), 200


@llm_bp.route('/llm', methods=['GET'])
def chat_history():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    if "user_id" not in data:
        return jsonify({"error": f"Missing field: user_id"}), 400
    user_id = data["user_id"]

    chat_history = ChatbotHistory.query.filter_by(user_id=user_id).first()
    if not chat_history:
        return jsonify({'message': 'Chat history not found'}), 404

    return jsonify({'Chat history': chat_history.context}), 404


@llm_bp.route('/llm', methods=['DELETE'])
def clear_chat_history():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    if "user_id" not in data:
        return jsonify({"error": f"Missing field: user_id"}), 400
    user_id = data["user_id"]

    chat_history = ChatbotHistory.query.filter_by(user_id=user_id).first()
    if not chat_history:
        return jsonify({'message': 'Chat history not found'}), 404

    try:
        db.session.delete(chat_history)
        db.session.commit()
        return jsonify({'message': 'Chat history deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@llm_bp.route('/embed', methods=['POST'])
def embed_text():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    if "text" not in data:
        return jsonify({"error": "Missing field: text"}), 400

    text_to_embed = data["text"]

    try:
        embedding = get_embedding(text_to_embed)
        return jsonify({"embedding": embedding}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@llm_bp.route('/embedProject', methods=['POST'])
def embed_project():
    data = request.get_json()
    return generate_project_embedding(data)


def generate_project_embedding(data):
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    required_fields = ["project_title", "project_description", "project_status", "id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    text_to_embed = "title: " + data["project_title"] + "; description: " + data["project_description"]

    if 'keywords' in data:
        text_to_embed += "; keywords: " + ", ".join(data['keywords'])

    try:
        embedding = get_embedding(text_to_embed)
        metadata = {"project_status": data["project_status"], "project_title": data["project_title"]}
        return jsonify(
            {"namespace": "projectNS1", "vector_id": data["id"], "vector": embedding, "metadata": metadata}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def initial_prompt(user_id, top_k=10):
    interests = get_user_interests(Student, user_id)
    projects = []#get_projects()[0].get_json()

    formatted_projects = []

    for project in projects[:top_k]:
        title = project.get("project_title", "No Title")
        description = project.get("project_description", "No Description")[:200]
        status = project.get("project_status", "Unknown Status")

        formatted_projects.append(f"- {title} ({status})\n  Description: {description}...")

    projects_str = "\n\n".join(formatted_projects)

    prompt = f"""
        You are an intelligent assistant designed to help students choose a final year project. The student has expressed interest in {interests}. 

        Here is a list of available projects: 
        {projects_str}

        Wait for the student to speak first before responding. Provide guidance and recommendations based on their interests and the available projects.
    """

    return prompt
