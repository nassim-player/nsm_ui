
import React, { useState, useRef, useEffect } from 'react';
import './PageHero.scss';
import PropTypes from 'prop-types';
import { Bell, Calendar, MessageCircle, UserPlus, AlertCircle, X, Globe, Sun, Moon } from 'react-feather';

export const PageHero = ({
    user,
    title,
    subtitle,
    notificationCount = 0,
    currentLanguage = 'ar', // Default prop
    onLanguageChange,
    actions,
    className = ''
}) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    // Removed internal state for language
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check if dark mode was previously set
        return document.body.classList.contains('dark-mode');
    });
    const dropdownRef = useRef(null);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
    };

    const languages = [
        { code: 'ar', label: 'العربية' },
        { code: 'fr', label: 'Français' },
        { code: 'en', label: 'English' }
    ];

    const defaultDate = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Placeholder notifications
    const notifications = [
        {
            id: 1,
            icon: <MessageCircle size={18} />,
            title: 'رسالة جديدة',
            message: 'لديك رسالة جديدة من الإدارة',
            time: 'منذ 5 دقائق',
            unread: true
        },
        {
            id: 2,
            icon: <UserPlus size={18} />,
            title: 'تسجيل جديد',
            message: 'تم تسجيل طالب جديد في النظام',
            time: 'منذ ساعة',
            unread: true
        },
        {
            id: 3,
            icon: <AlertCircle size={18} />,
            title: 'تذكير',
            message: 'اجتماع أولياء الأمور غداً',
            time: 'منذ 3 ساعات',
            unread: false
        }
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <section className={`page-hero ${className}`}>
            <div className="page-hero-content">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    {/* User Profile Section */}
                    <div className="header-user-section">
                        <div className="header-avatar">
                            <span>{user?.initial || (user?.name ? user.name.charAt(0) : 'U')}</span>
                        </div>
                        <div className="header-user-info">
                            <h2 className="header-user-name">{title || user?.name}</h2>
                            <span className="header-user-role">{subtitle || user?.role}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="header-actions">
                        {/* Notification Bell with Dropdown */}
                        <div className="notification-wrapper" ref={dropdownRef}>
                            <div
                                className={`notification-bell ${isNotificationOpen ? 'active' : ''}`}
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            >
                                <Bell size={20} />
                                {notificationCount > 0 && (
                                    <span className="notification-badge">{notificationCount}</span>
                                )}
                            </div>

                            {/* Notification Dropdown */}
                            {isNotificationOpen && (
                                <div className="notification-dropdown">
                                    <div className="notification-header">
                                        <h3>الإشعارات</h3>
                                        <button className="close-btn" onClick={() => setIsNotificationOpen(false)}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <div className="notification-list">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                                                <div className="notification-icon">
                                                    {notif.icon}
                                                </div>
                                                <div className="notification-content">
                                                    <h4>{notif.title}</h4>
                                                    <p>{notif.message}</p>
                                                    <span className="notification-time">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="notification-footer">
                                        <button className="view-all-btn">عرض كل الإشعارات</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Language Selector */}
                        <div className="language-wrapper">
                            <div className="language-trigger">
                                <Globe size={20} />
                            </div>
                            <div className="language-dropdown">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                                        onClick={() => {
                                            onLanguageChange?.(lang.code);
                                        }}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <div
                            className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
                            onClick={toggleDarkMode}
                            title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
                        >
                            <div className="toggle-icon">
                                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </div>
                        </div>

                        {/* Date Display */}
                        <div className="header-date">
                            <Calendar size={16} />
                            <span>{defaultDate}</span>
                        </div>

                        {actions}
                    </div>
                </div>
            </div>
        </section>
    );
};

PageHero.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        role: PropTypes.string,
        initial: PropTypes.string
    }),
    title: PropTypes.string,
    subtitle: PropTypes.string,
    notificationCount: PropTypes.number,
    currentLanguage: PropTypes.string,
    onLanguageChange: PropTypes.func,
    actions: PropTypes.node,
    className: PropTypes.string
};
