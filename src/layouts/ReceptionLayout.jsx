import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Activity, Calendar, FileText } from 'react-feather';
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
            <nav className="reception-subnav">
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
            <div className="reception-content">
                <Outlet />
            </div>
        </div>
    );
};
