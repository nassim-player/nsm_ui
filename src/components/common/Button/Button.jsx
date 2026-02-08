import React from 'react';
import './Button.scss';
import PropTypes from 'prop-types';

export const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    onClick,
    className = '',
    disabled = false,
    ...props
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

export const IconButton = ({
    children,
    onClick,
    type = 'button',
    className = '',
    title = '',
    disabled = false,
    color = 'primary', // primary, danger, etc.
    ...props
}) => {
    return (
        <button
            type={type}
            className={`icon-btn icon-btn-${color} ${className}`}
            onClick={onClick}
            title={title}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

IconButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    color: PropTypes.string
};
