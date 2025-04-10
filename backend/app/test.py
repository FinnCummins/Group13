import requests
import pytest
from app import create_app, db  # Adjust import according to your package structure
from models import User  # Import your model
from config import TestConfig
from unittest.mock import patch

BASE_URL = "http://127.0.0.1:5001/api/projects"

# Sample test data
TEST_USER = {"email": "testuser@example.com", "password": "TestPass123"}
TEST_PROJECT = {"title": "AI Chatbot", "category": "Machine Learning", "difficulty": "Intermediate"}


def test_upsert_vector(client):
    mock_data = {
        "vector_id": "1",
        "vector": [0.1, 0.2, 0.3],
        "metadata": {"info": "test"}
    }
    # Patching the function directly in the blueprint
    with patch('app.vector_db.upsert_vector') as mock_upsert:
        response = client.post(f"{BASE_URL}", json=mock_data)
        assert response.status_code == 200
        mock_upsert.assert_called_once()

def test_query_vectors(client):
    query_data = {
        "vector": [0.1, 0.2, 0.3],
        "top_k": 5
    }
    # Patching the function directly in the blueprint
    with patch('app.vector_db.query_vectors') as mock_query:
        response = client.post(f"{BASE_URL}", json=query_data)
        assert response.status_code == 200
        mock_query.assert_called_once()
        
        

#initialising
def test_fetch_projects_with_basic_auth():
    auth = ('username', 'password')  # Replace with actual credentials
    response = requests.get(f"{BASE_URL}", auth=auth)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
# Fixtures
@pytest.fixture
def client():
    app = create_app(TestConfig())
    with app.app_context():
        db.create_all()
        yield app.test_client()  # Return the test client
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope='module')
def test_client():
    flask_app = create_app('TestConfig')
    
    testing_client = flask_app.test_client()

    # Establish an application context before running the tests.
    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()

@pytest.fixture(scope='module')
def init_database():
    # Setup database, potentially run migrations
    db.create_all()
    # Insert user data
    user1 = User(email='test@test.com', plaintext_password='FlaskIsAwesome')
    db.session.add(user1)
    db.session.commit()
    yield db  # this is where the testing happens!
    db.session.close()
    db.drop_all()

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()  # Set up database tables for tests
        yield app
        db.session.remove()
        db.drop_all()
        
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
    response = client.get(f"{BASE_URL}/projects", headers=test_fetch_projects_with_basic_auth())
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_project(client, init_database):
    # Assumes supervisor exists
    response = client.post(f"{BASE_URL}/projects", headers=test_fetch_projects_with_basic_auth(), json=TEST_PROJECT)
    assert response.status_code == 201
    assert response.json()['title'] == TEST_PROJECT['title']

def test_update_project(client, init_database):
    # First, create a project
    create_resp = client.post(f"{BASE_URL}/projects", headers=test_fetch_projects_with_basic_auth(), json=TEST_PROJECT)
    project_id = create_resp.json()['id']
    # Update the project
    update_resp = client.put(f"{BASE_URL}/projects/{project_id}", headers=test_fetch_projects_with_basic_auth(), json={"title": "Updated Title"})
    assert update_resp.status_code == 200
    assert update_resp.json()['title'] == "Updated Title"

def test_delete_project(client, init_database):
    # First, create a project
    create_resp = client.post(f"{BASE_URL}/projects", headers=test_fetch_projects_with_basic_auth(), json=TEST_PROJECT)
    project_id = create_resp.json()['id']
    # Delete the project
    delete_resp = client.delete(f"{BASE_URL}/projects/{project_id}", headers=test_fetch_projects_with_basic_auth())
    assert delete_resp.status_code == 200


def test_api_health_check():
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    assert response.json().get("status") == "ok"


def test_home_page(test_client, init_database):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' home page is requested (GET)
    THEN check the response is valid
    """
    response = test_client.get('/')
    assert response.status_code == 200
    assert b"Welcome to the Flask Test" in response.data

def test_user_registration(test_client, init_database):
    """
    Test user registration
    """
    response = test_client.post('/register',
                                data=dict(email='new@test.com', password='example'),
                                follow_redirects=True)
    assert response.status_code == 200
    assert b"Registration successful" in response.data



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
    response = requests.delete(f"{BASE_URL}", headers=headers)  # Replace '1' with actual project ID
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
