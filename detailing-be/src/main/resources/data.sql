DELETE FROM experiences;
DELETE FROM projects;
DELETE FROM users;

INSERT INTO users (id, name, title, bio, skills) VALUES
    (1, 'Zachary Lelièvre', 'Software Developer',
     'Passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable solutions with beautiful user interfaces.',
     'Java, Spring Boot, React, TypeScript, Docker, MySQL');

INSERT INTO projects (title, description, technologies, user_id) VALUES
                                                                     ('Car Detailing Management System', 'Full-stack application for managing car detailing services', 'Spring Boot, React, MySQL', 1),
                                                                     ('E-commerce Platform', 'Microservices-based online shopping platform', 'Node.js, TypeScript, MongoDB', 1);

INSERT INTO experiences (company, role, duration, description, user_id) VALUES
                                                                            ('EMsolution', 'Software Developer', 'Starting Soon', 'Upcoming role as a Software Developer at EMsolution.', 1),
                                                                            ('Wal-Mart', 'Customer Experience and Sales', 'July 2021 - Present', 'Assisting customers, handling orders, etc.', 1),
                                                                            ('Capsol Inc.', 'Office Clerk', 'Jan 2019 - Jun 2021', 'Data entry and filing.', 1);