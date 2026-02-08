
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Grid, Users, Calendar } from 'react-feather';
import './RegistrationLayout.scss';

export const RegistrationLayout = () => {
    const location = useLocation();

    const subLinks = [
        { to: '/registration', icon: Grid, label: 'نظرة عامة', exact: true },
        { to: '/registration/requests', icon: Users, label: 'الطلبات الجديدة' },
        { to: '/registration/meetings', icon: Calendar, label: 'الاجتماعات' },
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
