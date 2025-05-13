CREATE TABLE IF NOT EXISTS users (
                                     id INT AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    skills TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS projects (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    link VARCHAR(255),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS experiences (
                                           id INT AUTO_INCREMENT PRIMARY KEY,
                                           company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

CREATE TABLE IF NOT EXISTS comments (
                                        id INT AUTO_INCREMENT PRIMARY KEY,
                                        author_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );