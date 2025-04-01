import pytest
from app import create_app, db  # Replace 'flask_app' with the actual name of your Flask app's file
from unittest.mock import patch
import json
from flask import Flask
from config import TestConfig

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app(TestConfig())  # Passing an instance of TestConfig
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()

def test_upsert_vector(client):
    mock_data = {
        "vector_id": "1",
        "vector": [0.1, 0.2, 0.3],
        "metadata": {"info": "test"}
    }
    with patch('path.to.your.vector_db_module.index.upsert') as mock_upsert:
        mock_upsert.return_value = None
        response = client.post('/vector/upsert', data=json.dumps(mock_data), content_type='application/json')
        assert response.status_code == 200
        assert mock_upsert.called

def test_query_vectors(client):
    query_data = {
        "vector": [0.1, 0.2, 0.3],
        "top_k": 5
    }
    with patch('path.to.your.vector_db_module.index.query') as mock_query:
        mock_query.return_value = {"matches": []}
        response = client.post('/vector/query', data=json.dumps(query_data), content_type='application/json')
        assert response.status_code == 200
        assert 'matches' in response.json
