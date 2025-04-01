import requests
import pytest
import json

BASE_URL = "http://127.0.0.1:5001/api/projects"

VECTOR_BASE_URL = "http://127.0.0.1:5001/api/vector"

TEST_VECTOR = {
    "vector_id": "test123",
    "vector": [0.1, 0.2, 0.3, ...],  # Example vector data
    "metadata": {"info": "Test vector"}
}

# Sample test data
TEST_USER = {"email": "testuser@example.com", "password": "TestPass123"}
TEST_PROJECT = {"title": "AI Chatbot", "category": "Machine Learning", "difficulty": "Intermediate"}


def test_api_health_check():
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    assert response.json().get("status") == "ok"


def test_user_registration():
    response = requests.post(f"{BASE_URL}/register", json=TEST_USER)
    assert response.status_code == 201 or response.status_code == 400  # 400 if user exists


def test_user_login():
    response = requests.post(f"{BASE_URL}/login", json=TEST_USER)
    assert response.status_code == 200
    assert "token" in response.json()
    return response.json().get("token")


def test_fetch_project_list():
    response = requests.get(f"{BASE_URL}/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_search_project():
    response = requests.get(f"{BASE_URL}/projects/search?query=AI")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_project():
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/projects", json=TEST_PROJECT, headers=headers)
    assert response.status_code == 201
    assert response.json().get("title") == TEST_PROJECT["title"]


def test_delete_project():
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(f"{BASE_URL}/projects/1", headers=headers)  # Replace '1' with actual project ID
    assert response.status_code in [200, 404]  # 404 if project doesn't exist


def test_recommendation_system():
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/recommendations", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_rate_limiting():
    for _ in range(10):  # Assuming the API has a rate limit policy
        response = requests.get(f"{BASE_URL}/health")
    assert response.status_code in [200, 429]  # 429 if rate limit exceeded

def test_upsert_vector():
    response = requests.post(f"{VECTOR_BASE_URL}/upsert", json=TEST_VECTOR)
    assert response.status_code == 200
    assert response.json().get("message") == "Vector upserted successfully"

def test_query_vector():
    response = requests.post(f"{VECTOR_BASE_URL}/query", json={"vector": [0.1, 0.2, 0.3, ...]})
    assert response.status_code == 200
    assert isinstance(response.json().get("matches"), list)

def test_delete_vector():
    response = requests.delete(f"{VECTOR_BASE_URL}/delete", json={"vector_ids": ["test123"]})
    assert response.status_code == 200
    assert response.json().get("message") == "Vectors deleted successfully"

if __name__ == "__main__":
    pytest.main()
