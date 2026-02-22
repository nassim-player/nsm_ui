import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Calendar, MessageSquare, Bell } from 'react-feather';
import './HubLayout.scss';

export const HubLayout = () => {
    const { t } = useTranslation();

    const subLinks = [
        { to: '/hub', icon: Calendar, label: t('hub.nav_calendar'), exact: true },
        { to: '/hub/publications', icon: MessageSquare, label: t('hub.publications') || 'المنشورات والإشعارات' },
    ];

    return (
        <div className="hub-layout">
            <nav className="hub-subnav">
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
            <div className="hub-content">
                <Outlet />
            </div>
        </div>
    );
};
