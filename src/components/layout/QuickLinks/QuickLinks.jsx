
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Calendar, Mail, FileText, Settings, UserPlus } from 'react-feather';
import './QuickLinks.scss';
import PropTypes from 'prop-types';

export const QuickLinks = ({ className = '' }) => {
    // These could be dynamic based on role in later versions
    const links = [
        { to: '/new-task', icon: Plus, label: 'مهمة جديدة', primary: true },
        { to: '/registration', icon: UserPlus, label: 'التسجيلات' },
        { to: '/calendar', icon: Calendar, label: 'التقويم' },
        { to: '/messages', icon: Mail, label: 'الرسائل', badge: 5 },
        { to: '/reports', icon: FileText, label: 'التقارير' },
        { to: '/settings', icon: Settings, label: 'الإعدادات' },
    ];

    return (
        <div className={`quick-links-bar ${className}`}>
            <div className="quick-links-container">
                {links.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.to}
                        className={({ isActive }) => `quick-link-item ${isActive ? 'active' : ''} ${link.primary ? 'primary' : ''}`}
                    >
                        <div className="quick-link-icon">
                            <link.icon size={20} />
                            {link.badge > 0 && <span className="quick-link-badge">{link.badge}</span>}
                        </div>
                        <span className="quick-link-label">{link.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

QuickLinks.propTypes = {
    className: PropTypes.string
};
