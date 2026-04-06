import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './SubNav.scss';

export const SubNav = ({ links, className = '' }) => {
    return (
        <nav className={`global-subnav ${className}`}>
            {links.map((link, index) => (
                <NavLink
                    key={index}
                    to={link.to}
                    end={link.exact}
                    className={({ isActive }) =>
                        `subnav-link ${isActive ? 'active' : ''} ${link.primary ? 'primary' : ''}`
                    }
                >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

SubNav.propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
        to: PropTypes.string.isRequired,
        icon: PropTypes.elementType.isRequired,
        label: PropTypes.string.isRequired,
        exact: PropTypes.bool,
        primary: PropTypes.bool
    })).isRequired,
    className: PropTypes.string
};
