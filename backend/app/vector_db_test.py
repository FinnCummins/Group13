import pytest
from app import create_app  # Update import paths as necessary
from app.models import db  # Adjust according to your actual DB setup
from unittest.mock import patch
import json

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app('config.TestConfig')  # Make sure this import and reference are correct
    with app.app_context():
        db.create_all()
    yield app
    with app.app_context():
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

def test_upsert_vector(client):
    mock_data = {
        "vector_id": "1",
        "vector": [0.1, 0.2, 0.3],
        "metadata": {"info": "test"}
    }
    with patch('app.vector_db.index.upsert') as mock_upsert:  # Adjust import path to your module
        mock_upsert.return_value = None
        response = client.post('/api/vector/upsert', data=json.dumps(mock_data), content_type='application/json')
        assert response.status_code == 200
        assert mock_upsert.called

def test_query_vectors(client):
    query_data = {
        "text": "test query",
        "top_k": 5
    }
    expected_vector = [0.1, 0.2, 0.3]  # Example vector
    with patch('app.vector_db.get_embedding', return_value=expected_vector) as mock_get_embedding, \
         patch('app.vector_db.index.query') as mock_query:
        mock_query.return_value = {"matches": []}
        response = client.post('/api/vector/query', data=json.dumps(query_data), content_type='application/json')
        assert response.status_code == 200
        assert 'matches' in response.json
        assert mock_get_embedding.called

