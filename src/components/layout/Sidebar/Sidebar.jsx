
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';
import PropTypes from 'prop-types';
import {
    Grid, Calendar, FileText, LogOut,
    Users, Book, Home, Layout, Clock, UserPlus
} from 'react-feather';

const NAVIGATION_CONFIG = {
    Director: [
        {
            name: 'nav.management',
            items: [
                { href: '/', icon: Grid, label: 'لوحة التحكم' },
                { href: '/teachers', icon: Users, label: 'إدارة الأساتذة' },
                { href: '/students', icon: Users, label: 'إدارة الطلاب' },
                { href: '/registration', icon: UserPlus, label: 'إدارة التسجيلات' },
                { href: '/academic', icon: Book, label: 'إدارة أكادمية' },
                { href: '/hub', icon: Calendar, label: 'التقويم و الإعلانات' }
            ]
        },
        {
            name: 'nav.account',
            items: [
                { href: '#', icon: LogOut, label: 'تسجيل الخروج', action: 'logout' }
            ]
        }
    ],
    HR_Manager: [
        {
            name: 'nav.dashboard',
            items: [
                { href: 'index.html', icon: Grid, label: 'لوحة التحكم' }
            ]
        },
        {
            name: 'nav.management',
            items: [
                { href: 'index.html', icon: Users, label: 'إدارة الموظفين' },
                { href: 'index.html', icon: Layout, label: 'الهيكل التنظيمي' },
                { href: 'index.html', icon: Clock, label: 'الحضور' }
            ]
        },
        {
            name: 'nav.account',
            items: [
                { href: '#', icon: LogOut, label: 'تسجيل الخروج', action: 'logout' }
            ]
        }
    ],
    // Add other roles as needed
    Default: [
        {
            name: 'nav.main',
            items: [
                { href: 'index.html', icon: Home, label: 'الرئيسية' }
            ]
        }
    ]
};

export const Sidebar = ({ role = 'Director', onLogout, className = '' }) => {
    const [activeLink, setActiveLink] = useState('index.html'); // Default active
    const navSections = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG['Default'];

    const logoPath = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%233b82f6"/%3E%3Ctext x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold"%3EEF%3C/text%3E%3C/svg%3E';

    const handleItemClick = (e, item) => {
        if (item.action === 'logout') {
            e.preventDefault();
            if (onLogout) onLogout();
        }
        // No need to set activeLink manually, NavLink handles it
    };

    return (
        <div id="collapsibleSidebar" className={`sidebar ${className}`}>
            {/* Logo Section */}
            <div className="sidebar-logo-section">
                <div className="flex items-center justify-center w-full">
                    <div className="flex-shrink-0">
                        <div className="logo-container">
                            <img src={logoPath} alt="EL FADILA SCHOOL" className="logo-img" />
                        </div>
                    </div>
                    <div className="school-info hidden overflow-hidden">
                        <h1 className="school-title">EL FADILA SCHOOL</h1>
                        <p className="school-subtitle">نظام إدارة الموارد البشرية</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navSections.map((section, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <div className="nav-divider"></div>}
                        <div className="nav-section">
                            {section.items.map((item, itemIndex) => (
                                item.action === 'logout' ? (
                                    <a
                                        key={itemIndex}
                                        href={item.href}
                                        className="nav-item"
                                        onClick={(e) => handleItemClick(e, item)}
                                        data-action={item.action}
                                    >
                                        <div className="nav-icon-wrapper">
                                            <item.icon size={20} />
                                        </div>
                                        <span className="nav-label">
                                            {item.label}
                                        </span>
                                    </a>
                                ) : (
                                    <NavLink
                                        key={itemIndex}
                                        to={item.href === 'index.html' ? '/' : item.href}
                                        className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
                                    >
                                        <div className="nav-icon-wrapper">
                                            <item.icon size={20} />
                                        </div>
                                        <span className="nav-label">
                                            {item.label}
                                        </span>
                                    </NavLink>
                                )
                            ))}
                        </div>
                    </React.Fragment>
                ))}
            </nav>
        </div>
    );
};

Sidebar.propTypes = {
    role: PropTypes.string,
    onLogout: PropTypes.func,
    className: PropTypes.string
};
