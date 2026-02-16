
import React from 'react';
import './Card.scss';
import PropTypes from 'prop-types';

/**
 * A detail row for InfoCard
 */
export const InfoRow = ({ icon: Icon, label, value, color, className = '' }) => (
    <div className={`info-row ${className}`}>
        <div className="label-group">
            {Icon && <Icon size={14} className="icon" style={color ? { color } : {}} />}
            <span className="label">{label}:</span>
        </div>
        <span className="value">{value || '-'}</span>
    </div>
);

InfoRow.propTypes = {
    icon: PropTypes.elementType,
    label: PropTypes.node.isRequired,
    value: PropTypes.node,
    color: PropTypes.string,
    className: PropTypes.string
};

/**
 * A card for displaying structured information (like parent details, etc.)
 */
export const InfoCard = ({
    title,
    subtitle,
    icon: Icon,
    badge,
    variant = 'default', // default, primary, secondary, success, warning, error, info
    highlight = false,
    children,
    className = '',
    headerActions
}) => {
    return (
        <div className={`info-card variant-${variant} ${highlight ? 'highlight' : ''} ${className}`}>
            <div className={`card-header ${variant}`}>
                <div className="header-main">
                    {Icon && <Icon size={18} />}
                    <h4>{title}</h4>
                </div>
                <div className="header-extra">
                    {badge && <span className="card-badge">{badge}</span>}
                    {headerActions}
                </div>
            </div>
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};

InfoCard.propTypes = {
    title: PropTypes.node.isRequired,
    subtitle: PropTypes.node,
    icon: PropTypes.elementType,
    badge: PropTypes.node,
    variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'father', 'mother', 'guardian', 'family']),
    highlight: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    headerActions: PropTypes.node
};
