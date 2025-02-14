import pytest
import sys
import os
from unittest.mock import patch

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app
from models import Student

@pytest.fixture
def client():
    """Creates a test client for Flask."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def mock_get_users(model):
    """Mock function for get_users(Student)"""
    return [
        {
            "id": 1,
            "first_name": "Alice",
            "last_name": "Johnson",
            "email": "alice@example.com",
            "college_id": "C123",
            "interests": ["AI", "Cybersecurity"],
            "created_at": "2024-02-12T12:00:00"
        },
        {
            "id": 2,
            "first_name": "Bob",
            "last_name": "Smith",
            "email": "bob@example.com",
            "college_id": "C456",
            "interests": ["Data Science", "Cloud Computing"],
            "created_at": "2024-02-11T10:30:00"
        }
    ]

@patch("user.get_users", side_effect=mock_get_users)
def test_get_students(mock_get_users, client):
    """Test the /api/students endpoint."""
    response = client.get("/api/students")
    assert response.status_code == 200
    data = response.get_json()

    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["first_name"] == "Alice"
    assert data[1]["first_name"] == "Bob"
    assert data[0]["interests"] == ["AI", "Cybersecurity"]
