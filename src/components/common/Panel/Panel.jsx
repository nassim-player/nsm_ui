
import React from 'react';
import './Panel.scss';
import PropTypes from 'prop-types';

/**
 * A reusable Panel component for dashboard-like layouts.
 */
export const Panel = ({
    title,
    icon: Icon,
    badge,
    badgeVariant = 'primary',
    actions,
    children,
    className = '',
    contentClassName = '',
    variant = 'default',
    fullWidth = false,
    loading = false,
    glass = false
}) => {
    return (
        <div className={`panel-container ${variant} ${fullWidth ? 'full-width' : ''} ${glass ? 'glass' : ''} ${className}`}>
            <div className="panel-header">
                <div className="header-title">
                    {Icon && <Icon size={16} />}
                    {title && <h3>{title}</h3>}
                </div>
                <div className="header-actions">
                    {badge !== undefined && (
                        <span className={`panel-badge ${badgeVariant}`}>
                            {badge}
                        </span>
                    )}
                    {actions}
                </div>
            </div>
            <div className={`panel-body ${contentClassName}`}>
                {loading ? (
                    <div className="panel-loading">
                        <div className="spinner"></div>
                    </div>
                ) : children}
            </div>
        </div>
    );
};

Panel.propTypes = {
    title: PropTypes.node,
    icon: PropTypes.elementType,
    badge: PropTypes.node,
    badgeVariant: PropTypes.string,
    actions: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    variant: PropTypes.oneOf(['default', 'bordered', 'flat']),
    fullWidth: PropTypes.bool,
    loading: PropTypes.bool,
    glass: PropTypes.bool
};
