import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

export const TeachersOverview = () => {
    const { t } = useTranslation();

    return (
        <div className="teachers-overview">
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: 'var(--glass-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {t('nav.overview')}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>هذه الصفحة قيد الإنشاء</p>
            </div>
        </div>
    );
};
