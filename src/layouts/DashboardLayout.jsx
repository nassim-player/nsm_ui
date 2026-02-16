
import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar/Sidebar';
import { PageHero } from '../components/layout/PageHero/PageHero';
import './DashboardLayout.scss';

export const DashboardLayout = () => {
    const { language, changeLanguage } = useTranslation();
    const user = { name: 'الإدارة', role: 'مدرسة الفضيلة الخاصة', initial: 'م' };

    return (
        <div className="dashboard-layout">
            <Sidebar role="Director" onLogout={() => console.log('Logging out...')} />

            <main className="main-content">
                <PageHero
                    user={user}
                    notificationCount={3}
                    currentLanguage={language}
                    onLanguageChange={(lang) => changeLanguage(lang)}
                />

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
