import os
from openai import OpenAI
from flask import Blueprint, request, jsonify
from models import ChatbotHistory, db


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
        chat_context = ChatbotHistory(user_id=user_id, context=message)
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

def call_open_ai(prompt):
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=openai_api_key)

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        raise