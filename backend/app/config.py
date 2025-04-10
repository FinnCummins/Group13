class Config:
    SECRET_KEY = '\xdfA\x80\xd9. \xf73\x83\xec\x81\x91I\xdb\xadw\xa3\xa8\x89g\xc1\xa4A\xa9'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///mydatabase.db'

class TestConfig(Config):
    """Testing configuration with separate test database."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # Use in-memory database for tests
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///production_database.db'
