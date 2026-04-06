
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, Calendar, Mail, FileText, Settings, UserPlus } from 'react-feather';
import './QuickLinks.scss';
import PropTypes from 'prop-types';

export const QuickLinks = ({ links: customLinks, className = '' }) => {
    // Default links for backward compatibility if custom links are not provided
    const defaultLinks = [
        { to: '/new-task', icon: Plus, label: 'مهمة جديدة', primary: true },
        { to: '/registration', icon: UserPlus, label: 'التسجيلات' },
        { to: '/calendar', icon: Calendar, label: 'التقويم' },
        { to: '/messages', icon: Mail, label: 'الرسائل', badge: 5 },
        { to: '/reports', icon: FileText, label: 'التقارير' },
        { to: '/settings', icon: Settings, label: 'الإعدادات' },
    ];

    const displayLinks = customLinks || defaultLinks;

    return (
        <div className={`quick-links-bar ${className}`}>
            <div className="quick-links-container">
                {displayLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.to}
                        end={link.exact}
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
    links: PropTypes.arrayOf(PropTypes.shape({
        to: PropTypes.string.isRequired,
        icon: PropTypes.elementType.isRequired,
        label: PropTypes.string.isRequired,
        badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        primary: PropTypes.bool,
        exact: PropTypes.bool
    })),
    className: PropTypes.string
};
