import requests
import pytest

BASE_URL = "http://127.0.0.1:5001/api/projects"

# Sample test data
TEST_USER = {"email": "testuser@example.com", "password": "TestPass123"}
TEST_PROJECT = {"title": "AI Chatbot", "category": "Machine Learning", "difficulty": "Intermediate"}


#initialising
def auth_headers():
    access_token = create_access_token(identity=1)  # Assuming identity 1 is valid
    return {'Authorization': f'Bearer {access_token}'}

# Fixtures
@pytest.fixture
def client():
    from my_flask_app import create_app
    app = create_app('testing')
    with app.test_client() as client:
        yield client

@pytest.fixture
def init_database():
    # Setup database, potentially run migrations
    yield
    # Teardown database

# Test cases
def test_create_user(client, init_database):
    response = client.post(f"{BASE_URL}/users", json=TEST_USER)
    assert response.status_code == 201
    assert 'id' in response.json

def test_login(client, init_database):
    # Make sure the user exists in the database
    client.post(f"{BASE_URL}/users", json=TEST_USER)
    login_response = client.post(f"{BASE_URL}/login", json={"email": TEST_USER['email'], "password": TEST_USER['password']})
    assert login_response.status_code == 200
    assert 'token' in login_response.json

def test_fetch_projects(client, init_database):
    response = client.get(f"{BASE_URL}/projects", headers=auth_headers())
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_project(client, init_database):
    # Assumes supervisor exists
    response = client.post(f"{BASE_URL}/projects", headers=auth_headers(), json=TEST_PROJECT)
    assert response.status_code == 201
    assert response.json()['title'] == TEST_PROJECT['title']

def test_update_project(client, init_database):
    # First, create a project
    create_resp = client.post(f"{BASE_URL}/projects", headers=auth_headers(), json=TEST_PROJECT)
    project_id = create_resp.json()['id']
    # Update the project
    update_resp = client.put(f"{BASE_URL}/projects/{project_id}", headers=auth_headers(), json={"title": "Updated Title"})
    assert update_resp.status_code == 200
    assert update_resp.json()['title'] == "Updated Title"

def test_delete_project(client, init_database):
    # First, create a project
    create_resp = client.post(f"{BASE_URL}/projects", headers=auth_headers(), json=TEST_PROJECT)
    project_id = create_resp.json()['id']
    # Delete the project
    delete_resp = client.delete(f"{BASE_URL}/projects/{project_id}", headers=auth_headers())
    assert delete_resp.status_code == 200


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
    

if __name__ == "__main__":
    pytest.main()
