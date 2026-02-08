
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Users, Grid, FileText, Settings } from 'react-feather';
import './StudentsLayout.scss';

export const StudentsLayout = () => {
    const location = useLocation();
    const isMainPage = location.pathname === '/students';

    const subLinks = [
        { to: '/students', icon: Grid, label: 'نظرة عامة', exact: true },
        { to: '/students/organization', icon: Users, label: 'التنظيم' },
        { to: '/students/records', icon: FileText, label: 'السجلات', disabled: true },
        { to: '/students/settings', icon: Settings, label: 'الإعدادات', disabled: true },
    ];

    return (
        <div className="students-layout">
            {/* Sub-navigation for students section */}
            <nav className="students-subnav">
                {subLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.to}
                        end={link.exact}
                        className={({ isActive }) =>
                            `subnav-link ${isActive ? 'active' : ''} ${link.disabled ? 'disabled' : ''}`
                        }
                        onClick={(e) => link.disabled && e.preventDefault()}
                    >
                        <link.icon size={18} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Content area */}
            <div className="students-content">
                <Outlet />
            </div>
        </div>
    );
};
