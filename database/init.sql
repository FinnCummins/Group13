CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    interests TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supervisors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    staff_id VARCHAR(20) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    research_interests TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
