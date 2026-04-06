import React from 'react';
import { Outlet } from 'react-router-dom';
import { Shield, Monitor, Users } from 'react-feather';
import { SubNav } from '../components/common/SubNav/SubNav';
import { useTranslation } from '../context/LanguageContext';
import './SafeExitLayout.scss';

export const SafeExitLayout = () => {
    const { t } = useTranslation();

    const subLinks = [
        { to: '/safe-exit', icon: Monitor, label: t('safe_exit.nav_monitor') || 'شاشة البوابة المركزية', exact: true },
        { to: '/safe-exit/verify', icon: Shield, label: t('safe_exit.nav_verify') || 'التحقق الفوري' },
        { to: '/safe-exit/tracker', icon: Users, label: t('safe_exit.nav_tracker') || 'متابعة الحالة' },
    ];

    return (
        <div className="safe-exit-layout">
            <SubNav links={subLinks} />
            <div className="safe-exit-content">
                <Outlet />
            </div>
        </div>
    );
};
