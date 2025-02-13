import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

// ------------------ Navbar ------------------
const Navbar: React.FC<{ loginWithRedirect: () => void }> = ({ loginWithRedirect }) => {
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
        </>
    );
};

// ------------------ CommentsPage Component ------------------
interface CommentData {
    id?: number;
    authorName: string;
    content: string;
    status?: string;
}

const CommentsPage: React.FC = () => {
    const { loginWithRedirect } = useAuth0();
    const { t: rawT } = useTranslation();
    const t = rawT as (key: string) => string;

    const [comments, setComments] = useState<CommentData[]>([]);
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    // Fetch approved comments from deployed endpoint
    useEffect(() => {
        fetch('https://zachary-lelievre.com/api/comments')
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.error(err));
    }, []);

    // Submit new comment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://zachary-lelievre.com/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ authorName, content })
            });
            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            setAuthorName('');
            setContent('');
            setMessage(t('thankYouPending'));
        } catch (error) {
            console.error(error);
            setMessage(t('errorSubmitting'));
        }
    };

    return (
        <>
            <Navbar loginWithRedirect={loginWithRedirect} />
            <ParticlesBackground />

            <style>{`
        .comments-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          margin-top: 100px;
          color: var(--text-color);
        }
        .comments-page h2 {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: var(--primary-color);
          text-align: center;
        }
        .comment-list {
          margin-bottom: 2rem;
        }
        .comment-item {
          border-bottom: 1px solid #34495e;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .comment-author {
          font-weight: bold;
          color: var(--secondary-color);
        }
        .comment-form h3 {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        .comment-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .comment-form input,
        .comment-form textarea {
          width: 100%;
          max-width: 600px;
          padding: 0.5rem;
          margin-bottom: 1rem;
          background: var(--card-bg);
          border: 1px solid #34495e;
          color: #ffffff;
          border-radius: 4px;
          font-size: 1rem;
        }
        .comment-form button {
          background: var(--primary-color);
          border: none;
          color: #1a1a1a;
          padding: 0.6rem 1.2rem;
          border-radius: 30px;
          cursor: pointer;
          font-weight: bold;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .comment-form button:hover {
          background: var(--secondary-color);
        }
        .message {
          margin-top: 1rem;
          color: var(--secondary-color);
          font-weight: bold;
        }
      `}</style>

            <div className="comments-page">
                <h2>{t('comments')}</h2>
                <div className="comment-list">
                    {comments.map((c) => (
                        <div key={c.id} className="comment-item">
                            <p className="comment-author">{c.authorName} {t('says')}:</p>
                            <p>{c.content}</p>
                        </div>
                    ))}
                </div>
                <form className="comment-form" onSubmit={handleSubmit}>
                    <h3>{t('leaveComment')}</h3>
                    <div>
                        <label htmlFor="authorName">{t('name')}:</label>
                        <input
                            id="authorName"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content">{t('comment')}:</label>
                        <textarea
                            id="content"
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">{t('submit')}</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </>
    );
};

export default CommentsPage;