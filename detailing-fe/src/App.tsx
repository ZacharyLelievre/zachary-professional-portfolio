// src/App.tsx
import React from 'react';
import { motion } from 'framer-motion';
import './App.css';
import './img.png';
import ParticlesBackground from './ParticlesBackground';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SuccessPage from './SuccessPage';
import { useTranslation } from 'react-i18next';

interface Project {
    title: string;
    description: string;
    technologies: string;
}

interface Experience {
    company: string;
    role: string;
    duration: string;
    description: string;
}

interface User {
    name: string;
    title: string;
    bio: string;
    skills: string;
    projects: Project[];
    experiences: Experience[];
}

// Updated Navbar component with refreshed design
const Navbar: React.FC<{ loginWithRedirect: () => void }> = ({ loginWithRedirect }) => {
    // Force the 't' function's signature
    const { t: rawT, i18n } = useTranslation();
    const t = rawT as (key: string) => string;

    return (
        <>
            <style>{`
        .navbar {
          position: fixed;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          padding: 0.75rem 1.5rem;
          border-radius: 40px;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .nav-link {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .nav-link:hover {
          background: var(--primary-color);
          color: #1a1a1a;
        }
        .language-toggle {
          display: flex;
          gap: 0.5rem;
        }
        .language-toggle button {
          background: transparent;
          border: 1px solid #ffffff;
          border-radius: 20px;
          color: #ffffff;
          padding: 0.3rem 0.8rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .language-toggle button:hover {
          background: rgba(46, 204, 113, 0.2);
        }
        .login-button {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
          color: #ffffff;
          font-size: 1rem;
          font-weight: bold;
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }
        .login-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }
        .login-button:active {
          transform: scale(0.95);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
      `}</style>

            <nav className="navbar">
                <a href="#" className="nav-link">{t('home')}</a>
                <a href="#" className="nav-link">{t('about')}</a>
                <a href="#" className="nav-link">{t('projects')}</a>
                <a href="#" className="nav-link">{t('experience')}</a>
                <a href="#" className="nav-link">{t('contact')}</a>

                <div className="language-toggle">
                    <button onClick={() => i18n.changeLanguage('en')}>ENG</button>
                    <button onClick={() => i18n.changeLanguage('fr')}>FR</button>
                </div>

                <button className="login-button" onClick={() => loginWithRedirect()}>
                    Login
                </button>
            </nav>
        </>
    );
};

const App: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const { loginWithRedirect } = useAuth0();

    // Force the 't' function's signature again
    const { t: rawT } = useTranslation();
    const t = rawT as (key: string) => string;

    React.useEffect(() => {
        fetch('http://localhost:8080/api/user/1')
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('User not found');
                    }
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: User) => setUser(data))
            .catch(error => setError(error.message));
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, x: -50 },
        visibleLeft: { opacity: 1, x: 0 },
        visibleRight: { opacity: 1, x: 0 },
    };

    const animationProps = {
        initial: 'hidden',
        whileInView: 'visibleLeft',
        viewport: { once: false, amount: 0.5 },
        transition: { duration: 0.8 },
        variants: fadeIn,
    };

    if (error) return <div className="error">{error}</div>;
    if (!user) return <div className="loading">Loading...</div>;

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <>
                        <Navbar loginWithRedirect={loginWithRedirect} />
                        <div className="portfolio">
                            <ParticlesBackground />

                            <motion.header className="hero section" {...animationProps}>
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
                                    {user.skills
                                        ? user.skills.split(',').map(skill => skill.trim()).join(' • ')
                                        : t('noSkillsProvided')}
                                </div>
                            </motion.header>

                            <motion.section className="section about" {...animationProps}>
                                <h2>{t('aboutMe')}</h2>
                                <p className="bio">{user.bio}</p>
                            </motion.section>

                            <motion.section className="section projects" {...animationProps}>
                                <h2>{t('featuredProjects')}</h2>
                                <div className="project-grid">
                                    {user.projects.map((project, index) => (
                                        <motion.div
                                            key={index}
                                            className="project-card"
                                            initial="hidden"
                                            whileInView="visibleLeft"
                                            viewport={{ once: false, amount: 0.5 }}
                                            transition={{ duration: 0.5, delay: index * 0.2 }}
                                            variants={fadeIn}
                                        >
                                            <h3>{project.title}</h3>
                                            <p>{project.description}</p>
                                            <div className="tech-stack">
                                                {project.technologies.split(',').map((tech, i) => (
                                                    <span key={i} className="tech">{tech.trim()}</span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            <motion.section className="section timeline" {...animationProps}>
                                <h2>{t('experienceTimeline')}</h2>
                                <div className="timeline-container">
                                    {user.experiences.map((exp, index) => {
                                        const isLeft = index % 2 === 0;
                                        return (
                                            <div
                                                key={index}
                                                className={`timeline-item ${isLeft ? 'left' : 'right'}`}
                                            >
                                                <div className="timeline-dot" />
                                                <motion.div
                                                    className="timeline-content"
                                                    initial="hidden"
                                                    whileInView={isLeft ? 'visibleLeft' : 'visibleRight'}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                                    variants={fadeIn}
                                                >
                                                    <h3>{exp.role} at {exp.company}</h3>
                                                    <span className="timeline-duration">{exp.duration}</span>
                                                    <p>{exp.description}</p>
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.section>

                            <motion.footer className="contact" {...animationProps}>
                                <h2>{t('getInTouch')}</h2>
                                <div className="contact-links">
                                    <a href="mailto:lelievrezachary@gmail.com">
                                        <FaEnvelope className="icon" /> lelievrezachary@gmail.com
                                    </a>
                                    <a href="https://www.linkedin.com/in/zachary-lelièvre-757621230/">
                                        <FaLinkedin className="icon" /> LinkedIn
                                    </a>
                                    <a href="https://github.com/ZacharyLelievre">
                                        <FaGithub className="icon" /> GitHub
                                    </a>
                                </div>
                            </motion.footer>
                        </div>
                    </>
                }
            />
            <Route path="/success" element={<SuccessPage />} />
        </Routes>
    );
};

export default App;