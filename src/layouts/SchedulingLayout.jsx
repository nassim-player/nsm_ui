import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Cpu, Grid } from 'react-feather';
import './SchedulingLayout.scss';

export const SchedulingLayout = () => {
    const { t } = useTranslation();

    const subLinks = [
        { to: '/scheduling', icon: Cpu, label: t('scheduling.nav_generator'), exact: true },
        { to: '/scheduling/master', icon: Grid, label: t('scheduling.nav_master') },
    ];

    return (
        <div className="scheduling-layout">
            <nav className="scheduling-subnav">
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
            <div className="scheduling-content">
                <Outlet />
            </div>
        </div>
    );
};
