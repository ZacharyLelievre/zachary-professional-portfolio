import React, { useEffect, useState } from 'react';
import './App.css';
import './img.png';

interface User {
    name: string;
    title: string;
    bio: string;
    skills: string;
}

interface Project {
    title: string;
    description: string;
    technologies: string[];
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [projects] = useState<Project[]>([
        {
            title: "Car Detailing Management System",
            description: "Full-stack application for managing car detailing services",
            technologies: ["Spring Boot", "React", "MySQL"]
        },
        {
            title: "E-commerce Platform",
            description: "Microservices-based online shopping platform",
            technologies: ["Node.js", "TypeScript", "MongoDB"]
        }
    ]);
    const [error, setError] = useState<string | null>(null); // Add error state

    useEffect(() => {
        fetch('http://localhost:8080/api/user')
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('User not found');
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: User) => setUser(data)) // Type assertion
            .catch(error => setError(error.message)); // Set error message
    }, []);

    if (error) return <div className="error">{error}</div>; // Display error message

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="portfolio">
            {/* Hero Section */}
            <header className="hero">
                <div className="profile-image-container">
                    <img
                        src={require('./img.png')}
                        alt="Zachary Lelièvre"
                        className="profile-image"
                    />
                </div>
                <h1>{user.name}</h1>
                <h2>{user.title}</h2>
                <div className="skills">
                    {user.skills ? user.skills.split(',').map(skill => skill.trim()).join(' • ') : "No skills provided"}
                </div>
            </header>

            {/* About Section */}
            <section className="section">
                <h2>About Me</h2>
                <p className="bio">{user.bio}</p>
            </section>

            {/* Projects Section */}
            <section className="section projects">
                <h2>Featured Projects</h2>
                <div className="project-grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="tech-stack">
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className="tech">{tech}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <footer className="contact">
                <h2>Get in Touch</h2>
                <div className="contact-links">
                    <a href="mailto:lelievrezachary@gmail.com">lelievrezachary@gmail.com</a>
                    <a href="https://www.linkedin.com/in/zachary-lelièvre-757621230/">LinkedIn</a>
                    <a href="https://github.com/ZacharyLelievre">GitHub</a>
                </div>
            </footer>
        </div>
    );
};

export default App;