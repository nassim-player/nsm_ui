import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Grid, BookOpen, Eye, Clipboard } from 'react-feather';
import './AcademicLayout.scss';

export const AcademicLayout = () => {
    const { t } = useTranslation();

    const subLinks = [
        { to: '/academic', icon: Grid, label: t('academic.nav_overview'), exact: true },
        { to: '/academic/diary', icon: BookOpen, label: t('academic.nav_diary') },
        { to: '/academic/read-receipts', icon: Eye, label: t('academic.nav_read_receipts') },
        { to: '/academic/audit', icon: Clipboard, label: t('academic.nav_audit') },
    ];

    return (
        <div className="academic-layout">
            <nav className="academic-subnav">
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
            <div className="academic-content">
                <Outlet />
            </div>
        </div>
    );
};
