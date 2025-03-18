#!/usr/bin/env python
import os
import requests
from dotenv import load_dotenv
from backend.app.open_ai import get_embedding

# Load environment variables
load_dotenv()

# Configure API endpoints
PROJECTS_API_URL = os.getenv("PROJECTS_API_URL", "http://127.0.0.1:5001/api/projects")
VECTOR_API_URL = os.getenv("VECTOR_API_URL", "http://127.0.0.1:5001/api/upsert")


def get_all_projects():
    """Fetch all projects using the Flask API endpoint"""
    try:
        response = requests.get(PROJECTS_API_URL)
        if response.status_code == 200:
            projects = response.json()
            print(f"Successfully retrieved {len(projects)} projects")
            return projects
        else:
            print(f"Failed to retrieve projects: {response.status_code}")
            print(response.text)
            return []
    except Exception as e:
        print(f"Error retrieving projects: {e}")
        return []


def upsert_to_vector_db(vector_id, vector, metadata, namespace="projects"):
    """Upsert vector to Pinecone database"""
    payload = {
        "vector_id": vector_id,
        "vector": vector,
        "metadata": metadata,
        "namespace": namespace
    }
    
    try:
        response = requests.post(VECTOR_API_URL, json=payload)
        if response.status_code == 200:
            print(f"Successfully upserted vector for project {vector_id}")
            return True
        else:
            print(f"Failed to upsert vector: {response.json()}")
            return False
    except Exception as e:
        print(f"Error upserting vector: {e}")
        return False

def upsert_all_projects():
    """Fetch all projects via API and upsert them to the vector database"""
    projects = get_all_projects()
    print(f"Found {len(projects)} projects to process")
    
    success_count = 0
    failure_count = 0
    
    for project in projects:
        # Create text content for embedding
        # Combine title and description for a richer semantic representation
        content_to_embed = "title: " + project["project_title"] + "; description: " + project["project_description"]
        if 'keywords' in project:
            content_to_embed += "; keywords: " + ", ".join(project['keywords'])

        # Generate embedding
        vector = get_embedding(content_to_embed)
        if not vector:
            print(f"Skipping project {project['id']} due to embedding generation failure")
            failure_count += 1
            continue
        
        # Prepare metadata
        metadata = {
            "project_id": project['id'],
            "project_title": project['project_title'],
            "project_description": project['project_description'],
            "project_status": project['project_status'],
            "supervisor_id": project['supervisor_id'],
            "keywords": project.get('keywords', [])
        }
        
        # Use project ID as vector ID for easy reference
        vector_id = project['id']
        
        # Upsert to vector database
        if upsert_to_vector_db(vector_id, vector, metadata):
            success_count += 1
        else:
            failure_count += 1
    
    print(f"Upsert complete. Success: {success_count}, Failures: {failure_count}")
    return success_count, failure_count

if __name__ == "__main__":
    print("Starting project vector database upsert process...")
    upsert_all_projects()
    print("Process completed.")