
import React from 'react';
import './Badge.scss';
import PropTypes from 'prop-types';

export const Badge = ({ children, variant = 'info', className = '', ...props }) => {
    // If variant starts with 'status-' or 'priority-', use it as is.
    // Otherwise, check if it's one of the general types.
    // Or just append it to 'badge-' if closely following CSS naming.

    // CSS classes: badge-status-completed, badge-priority-high, badge-success

    let badgeClass = '';
    if (variant.startsWith('status-') || variant.startsWith('priority-')) {
        badgeClass = `badge-${variant}`;
    } else {
        badgeClass = `badge-${variant}`;
    }

    return (
        <span className={`badge ${badgeClass} ${className}`} {...props}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.string, // e.g., 'success', 'status-completed', 'priority-high'
    className: PropTypes.string
};
