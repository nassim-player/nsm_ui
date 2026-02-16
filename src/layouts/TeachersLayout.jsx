import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Grid, Users } from 'react-feather';
import './TeachersLayout.scss';

export const TeachersLayout = () => {
    const { t } = useTranslation();

    const subLinks = [
        { to: '/teachers', icon: Grid, label: t('nav.overview'), exact: true },
        { to: '/teachers/list', icon: Users, label: t('nav.teachers_list') || 'قائمة الأساتذة' },
    ];

    return (
        <div className="teachers-layout">
            <nav className="teachers-subnav">
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

            <div className="teachers-content">
                <Outlet />
            </div>
        </div>
    );
};
