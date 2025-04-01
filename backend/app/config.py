class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://myuser:mypassword@localhost/testdatabase'  # Adjust credentials as needed
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PINECONE_API_KEY = 'pcsk_5vxDAQ_BU8MaqESwP6KxTYpTtYysXRbPkdrARY6can3FidPCAfKiC69NxTnyJfs1L23syW'
    SECRET_KEY = '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'
