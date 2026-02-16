import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';

import { Grid, Users, Calendar, Settings, CheckCircle } from 'react-feather';
import './RegistrationLayout.scss';

export const RegistrationLayout = () => {
    const location = useLocation();

    const { t } = useTranslation();

    const subLinks = [
        { to: '/registration', icon: Grid, label: t('nav.overview'), exact: true },
        { to: '/registration/requests', icon: Users, label: t('nav.requests') },
        { to: '/registration/meetings', icon: Calendar, label: t('nav.meetings') },
        { to: '/registration/commissions', icon: Settings, label: t('nav.commissions') },
        { to: '/registration/finalization', icon: CheckCircle, label: t('nav.finalization') },
    ];

    return (
        <div className="registration-layout">
            {/* Sub-navigation for registration section */}
            <nav className="registration-subnav">
                {subLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.to}
                        end={link.exact}
                        className={({ isActive }) =>
                            `subnav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <link.icon size={18} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Content area */}
            <div className="registration-content">
                <Outlet />
            </div>
        </div>
    );
};
