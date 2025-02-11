// src/Navbar.tsx
import React from 'react';

const Navbar: React.FC = () => {
    return (
        <>
            <style>{`
        .navbar {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          background: rgba(26, 26, 26, 0.7); /* semi-transparent background */
          padding: 0.5rem 1rem;
          border-radius: 30px;
          z-index: 1000;
        }
        .nav-link {
          color: #ffffff; /* same as var(--text-color) */
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          transition: background 0.3s, color 0.3s;
        }
        .nav-link:hover {
          background: #2ecc71; /* same as var(--primary-color) */
          color: #1a1a1a;     /* same as var(--background) */
        }
      `}</style>
            <nav className="navbar">
                <a href="#" className="nav-link">Home</a>
                <a href="#" className="nav-link">About</a>
                <a href="#" className="nav-link">Projects</a>
                <a href="#" className="nav-link">Experience</a>
                <a href="#" className="nav-link">Contact</a>
            </nav>
        </>
    );
};

export default Navbar;