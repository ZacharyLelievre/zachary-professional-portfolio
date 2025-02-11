    // src/index.tsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import './index.css';
    import App from './App';
    import reportWebVitals from './reportWebVitals';

    // Import Auth0 React SDK & React Router
    import { Auth0Provider } from '@auth0/auth0-react';
    import { BrowserRouter } from 'react-router-dom';

    // If you still want to use auth0Config:
    import { auth0Config } from './auth-config';

    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            {/* Wrap everything in BrowserRouter so <Routes> in App.tsx works */}
            <BrowserRouter>
                <Auth0Provider
                    domain={auth0Config.domain}
                    clientId={auth0Config.clientId}
                    authorizationParams={{
                        redirect_uri: `${window.location.origin}/success`,
                        audience: auth0Config.audience,
                        scope: "openid profile email",
                    }}
                >
                    <App />
                </Auth0Provider>
            </BrowserRouter>
        </React.StrictMode>
    );

    reportWebVitals();