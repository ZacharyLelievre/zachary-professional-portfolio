// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Auth0 + React Router
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import { auth0Config } from './auth-config';

// i18n setup
import './i18n';                      // so i18n is initialized
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* Wrap everything in the I18nextProvider */}
        <I18nextProvider i18n={i18n}>
            <BrowserRouter>
                <Auth0Provider
                    domain={auth0Config.domain}
                    clientId={auth0Config.clientId}
                    authorizationParams={{
                        redirect_uri: `${window.location.origin}/success`,
                        audience: auth0Config.audience,
                        scope: "openid profile email",
                        screen_hint: "login"    // ← forces the login-only form
                    }}
                >
                    <App />
                </Auth0Provider>
            </BrowserRouter>
        </I18nextProvider>
    </React.StrictMode>
);

reportWebVitals();