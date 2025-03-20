#!/usr/bin/env python
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API endpoints
PROJECTS_API_URL = os.getenv("PROJECTS_API_URL", "http://127.0.0.1:5001/api/projects")
UPSERT_PROJECT_API_URL = os.getenv("UPSERT_PROJECT_API_URL", "http://127.0.0.1:5001/api/upsert_project")

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


def upsert_all_projects():
    """Fetch all projects via API and upsert them to the vector database"""
    projects = get_all_projects()
    print(f"Found {len(projects)} projects to process")

    success_count = 0
    failure_count = 0

    for project in projects:
        # Upsert to vector database
        response = requests.post(UPSERT_PROJECT_API_URL, json=project)

        if response.status_code == 200:
            success_count += 1
            print(f"Successfully upserted project {project['id']}")
        else:
            failure_count += 1
            print(f"Error upserting project {project['id']}: {response.text}")

    print(f"Upsert complete. Success: {success_count}, Failures: {failure_count}")
    return success_count, failure_count

if __name__ == "__main__":
    print("Starting project vector database upsert process...")
    upsert_all_projects()
    print("Process completed.")