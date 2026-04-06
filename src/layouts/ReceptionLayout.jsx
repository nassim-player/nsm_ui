import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Activity, Calendar, FileText } from 'react-feather';
import { SubNav } from '../components/common/SubNav/SubNav';
import './ReceptionLayout.scss';

export const ReceptionLayout = () => {
    const { t } = useTranslation();

    const subLinks = [
        { to: '/reception', icon: Activity, label: t?.('reception.nav_overview'), exact: true },
        { to: '/reception/requests', icon: Calendar, label: t?.('reception.nav_requests') },
        { to: '/reception/log', icon: FileText, label: t?.('reception.nav_log') },
    ];

    return (
        <div className="reception-layout">
            <SubNav links={subLinks} />
            <div className="reception-content">
                <Outlet />
            </div>
        </div>
    );
};
