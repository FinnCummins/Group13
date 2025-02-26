from flask import Blueprint, request, jsonify
import os
import numpy as np
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv

vector_bp = Blueprint('vector', __name__)

load_dotenv()

pinecone_api_key = os.getenv("PINECONE_API_KEY")
if not pinecone_api_key:
    raise ValueError("PINECONE_API_KEY is not set. Please check your .env file or environment variables.")

pc = Pinecone(api_key=pinecone_api_key)

index_name = "final-year-project"
vector_dimension = 1536

if index_name not in pc.list_indexes().names():
    print(f"Index '{index_name}' does not exist. Creating it now...")
    pc.create_index(
        name=index_name, 
        dimension=vector_dimension, 
        metric='cosine', 
        spec=ServerlessSpec(cloud='aws', region='us-east-1')
    )

index = pc.Index(index_name)

def validate_vector(vector, expected_dimension):
    if len(vector) != expected_dimension:
        return False
    return True

@vector_bp.route('/upsert', methods=['POST'])
def upsert_vector():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    required_fields = ["vector_id", "vector", "metadata"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400
    
    expected_dimension = vector_dimension
    
    if not validate_vector(data["vector"], expected_dimension):
        return jsonify({
            "error": f"Vector dimension mismatch. Expected: {expected_dimension}, got: {len(data['vector'])}"
        }), 400
    
    namespace = data.get("namespace", "ns1")
    
    try:
        vector_data = [(data["vector_id"], data["vector"], data["metadata"])]
        index.upsert(vectors=vector_data, namespace=namespace)
        return jsonify({
            "message": "Vector upserted successfully",
            "vector_id": data["vector_id"],
            "namespace": namespace
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vector_bp.route('/query', methods=['POST'])
def query_vectors():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    if "vector" not in data:
        return jsonify({"error": "Missing field: vector"}), 400
    
    expected_dimension = vector_dimension
    
    if not validate_vector(data["vector"], expected_dimension):
        return jsonify({
            "error": f"Vector dimension mismatch. Expected: {expected_dimension}, got: {len(data['vector'])}"
        }), 400
    
    namespace = data.get("namespace", "default")
    top_k = data.get("top_k", 10)
    include_values = data.get("include_values", True)
    include_metadata = data.get("include_metadata", True)
    filter_query = data.get("filter", None)
    
    try:
        response = index.query(
            namespace=namespace,
            vector=data["vector"],
            top_k=top_k,
            include_values=include_values,
            include_metadata=include_metadata,
            filter=filter_query
        )
        
        matches = []
        for match in response.matches:
            match_data = {
                "id": match.id,
                "score": float(match.score)
            }
            
            if hasattr(match, 'metadata') and match.metadata:
                match_data["metadata"] = match.metadata
                
            if hasattr(match, 'values') and match.values:
                match_data["values"] = [float(v) for v in match.values]
                
            matches.append(match_data)
            
        return jsonify({
            "matches": matches,
            "namespace": namespace
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@vector_bp.route('/delete', methods=['DELETE'])
def delete_vectors():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    if "vector_ids" not in data:
        return jsonify({"error": "Missing field: vector_ids"}), 400
    
    if not isinstance(data["vector_ids"], list) or len(data["vector_ids"]) == 0:
        return jsonify({"error": "vector_ids must be a non-empty list"}), 400
    
    namespace = data.get("namespace", "default")
    
    try:
        index.delete(ids=data["vector_ids"], namespace=namespace)
        return jsonify({
            "message": f"{len(data['vector_ids'])} vectors deleted successfully",
            "namespace": namespace
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500