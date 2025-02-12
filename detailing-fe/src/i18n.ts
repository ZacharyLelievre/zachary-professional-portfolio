// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already prevents XSS
        },
        backend: {
            // Points to your translation files, e.g. public/locales/en/translation.json
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
    });

export default i18n;