import React from 'react';
import { motion } from 'framer-motion';
import './App.css';
import './img.png';
import ParticlesBackground from './ParticlesBackground';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SuccessPage from './SuccessPage';
import CommentsPage from './CommentsPage';
import { useTranslation } from 'react-i18next';


interface Project {
    title: string;
    description: string;
    technologies: string;
    link: string; // Added link field
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

const Navbar: React.FC<{ loginWithRedirect: () => void }> = ({ loginWithRedirect }) => {
    const { t: rawT, i18n } = useTranslation();
    const t = rawT as (key: string) => string;
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    // Check if device is mobile on mount and window resize
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Initial check
        checkMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <>
            <style>{`
        /* Desktop navbar styles */
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
        
        /* Mobile navbar completely hidden */
        @media (max-width: 768px) {
          .navbar {
            display: none;
          }
        }
        
        /* Mobile hamburger button */
        .mobile-hamburger {
          position: fixed;
          top: 15px;
          right: 15px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          display: none; /* Hidden by default */
        }
        
        /* Only show hamburger on mobile */
        @media (max-width: 768px) {
          .mobile-hamburger {
            display: flex;
          }
        }
        
        .hamburger-line {
          display: block;
          width: 25px;
          height: 3px;
          margin: 2px 0;
          transition: all 0.3s ease-in-out;
          background-color: #ffffff;
        }
        
        .mobile-hamburger.open .hamburger-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        
        .mobile-hamburger.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        
        .mobile-hamburger.open .hamburger-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        
        /* Mobile menu styling */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 75%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          transform: translateX(100%);
          transition: transform 0.3s ease-in-out;
          z-index: 999;
          padding: 2rem;
        }
        
        .mobile-menu.open {
          transform: translateX(0);
        }
        
        .mobile-menu .nav-link {
          font-size: 1.2rem;
          padding: 0.7rem 1.2rem;
          width: 100%;
          text-align: center;
        }
        
        .mobile-menu .language-toggle {
          margin: 0.5rem 0;
        }
        
        .mobile-menu .login-button {
          margin: 0.5rem 0;
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
        
        /* Background overlay when mobile menu is open */
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          display: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .menu-overlay.open {
          display: block;
          opacity: 1;
        }
      `}</style>

            {/* Regular Navbar (desktop only) */}
            <nav className="navbar">
                <Link to="/" className="nav-link">{t('home')}</Link>
                <Link to="/comments" className="nav-link">{t('comments')}</Link>
                <div className="language-toggle">
                    <button onClick={() => i18n.changeLanguage('en')}>ENG</button>
                    <button onClick={() => i18n.changeLanguage('fr')}>FR</button>
                </div>
                <button className="login-button" onClick={() => loginWithRedirect()}>
                    Login
                </button>
            </nav>

            {/* Mobile Hamburger Button */}
            <div
                className={`mobile-hamburger ${mobileMenuOpen ? 'open' : ''}`}
                onClick={toggleMobileMenu}
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('home')}</Link>
                <Link to="/comments" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t('comments')}</Link>
                <div className="language-toggle">
                    <button onClick={() => {i18n.changeLanguage('en'); setMobileMenuOpen(false);}}>ENG</button>
                    <button onClick={() => {i18n.changeLanguage('fr'); setMobileMenuOpen(false);}}>FR</button>
                </div>
                <button className="login-button" onClick={() => {loginWithRedirect(); setMobileMenuOpen(false);}}>
                    Login
                </button>
            </div>

            {/* Overlay Background when mobile menu is open */}
            <div
                className={`menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
            ></div>
        </>
    );
};

const App: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const { loginWithRedirect } = useAuth0();
    const { t: rawT } = useTranslation();
    const t = rawT as (key: string) => string;

    React.useEffect(() => {
        fetch('https://zachary-lelievre.com/api/user/1')
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
            {/* Main portfolio page */}
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
                                    {user.projects.map((project, index) => {
                                        // Create the ProjectCard component with motion effects
                                        const ProjectContent = (
                                            <motion.div
                                                key={index}
                                                className="project-card"
                                                initial="hidden"
                                                whileInView="visibleLeft"
                                                viewport={{ once: false, amount: 0.5 }}
                                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                                variants={fadeIn}
                                                style={{
                                                    cursor: project.link ? 'pointer' : 'default',
                                                    transition: 'transform 0.3s, box-shadow 0.3s'
                                                }}
                                                whileHover={project.link ? {
                                                    scale: 1.03,
                                                    boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
                                                } : {}}
                                            >
                                                <h3>{project.title}</h3>
                                                <p>{project.description}</p>
                                                <div className="tech-stack">
                                                    {project.technologies.split(',').map((tech, i) => (
                                                        <span key={i} className="tech">{tech.trim()}</span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        );

                                        // If project has a link, wrap it in an anchor tag
                                        return project.link ? (
                                            <a
                                                key={index}
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    display: 'block'
                                                }}
                                            >
                                                {ProjectContent}
                                            </a>
                                        ) : ProjectContent;
                                    })}
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

                            {/* FOOTER */}
                            <motion.footer className="footer" {...animationProps}>
                                <div className="footer-column">
                                    <h3 className="footer-title">{t('footerContactTitle')}</h3>
                                    <p className="footer-subtext">{t('footerContactSubtext')}</p>
                                    <a href="/comments" className="footer-btn">
                                        {t('footerLeaveComment')}
                                    </a>
                                    <p className="footer-or">{t('footerOr')}</p>
                                    <a
                                        href="mailto:lelievrezachary@gmail.com"
                                        className="footer-btn"
                                    >
                                        {t('footerEmailMe')}
                                    </a>
                                </div>

                                <div className="footer-column">
                                    <h3 className="footer-title">{t('footerFollowTitle')}</h3>
                                    <p className="footer-subtext">{t('footerFollowSubtext')}</p>
                                    <div className="social-icons">
                                        <a href="https://www.linkedin.com/in/zachary-lelièvre-757621230/">
                                            <FaLinkedin />
                                        </a>
                                        <a href="https://github.com/ZacharyLelievre">
                                            <FaGithub />
                                        </a>
                                    </div>
                                </div>

                                <div className="footer-column">
                                    <h3 className="footer-title">{t('footerResumeTitle')}</h3>
                                    <p className="footer-subtext">{t('footerResumeSubtext')}</p>
                                    <div className="resume-buttons">
                                        <a href="/Zachary%20CV%20final.pdf" download className="footer-btn">
                                            EN
                                        </a>
                                        <a href="/Zachary%20Lelievre%20CV.pdf" download className="footer-btn">
                                            FR
                                        </a>
                                    </div>
                                </div>
                            </motion.footer>
                        </div>
                    </>
                }
            />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/comments" element={<CommentsPage />} />
        </Routes>
    );
};

export default App;