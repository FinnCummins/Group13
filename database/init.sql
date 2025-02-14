CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    college_id VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    interests TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supervisors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    college_id VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    interests TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    project_title VARCHAR(100) NOT NULL,
    project_description VARCHAR(2000) NOT NULL,
    keywords TEXT[],
    supervisor_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisor_id) REFERENCES supervisors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chatbotHistory (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    context TEXT,
    FOREIGN KEY (user_id) REFERENCES student(id) ON DELETE CASCADE
);