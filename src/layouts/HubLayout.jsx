import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Calendar, MessageSquare, Bell } from 'react-feather';
import { SubNav } from '../components/common/SubNav/SubNav';
import './HubLayout.scss';

export const HubLayout = () => {
    const { t } = useTranslation();

    const subLinks = [
        { to: '/hub', icon: Calendar, label: t('hub.nav_calendar'), exact: true },
        { to: '/hub/publications', icon: MessageSquare, label: t('hub.publications') || 'المنشورات والإشعارات' },
    ];

    return (
        <div className="hub-layout">
            <SubNav links={subLinks} />
            <div className="hub-content">
                <Outlet />
            </div>
        </div>
    );
};
