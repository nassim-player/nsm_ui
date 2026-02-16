import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../locales/translations.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('app-language') || 'ar'); // Default to 'ar'

    useEffect(() => {
        // Persist language preference
        localStorage.setItem('app-language', language);

        // Handle document direction for RTL/LTR support
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        document.body.dir = dir; // Also set on body for some CSS selectors if needed
    }, [language]);

    const t = (key) => {
        const keys = key.split('.');
        let result = translations;
        for (const k of keys) {
            if (result && result[k]) {
                result = result[k];
            } else {
                return key; // Return key if not found
            }
        }

        if (typeof result === 'object' && result !== null) {
            return result[language] || result['en'] || key;
        }

        return result;
    };

    const changeLanguage = (lang) => {
        if (['ar', 'en', 'fr'].includes(lang)) {
            setLanguage(lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
