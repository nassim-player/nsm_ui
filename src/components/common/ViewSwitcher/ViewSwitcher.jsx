
import React from 'react';
import './ViewSwitcher.scss';
import PropTypes from 'prop-types';

export const ViewSwitcher = ({ view, onChange, options = [
    { id: 'cards', icon: 'fa-th-large', label: 'بطاقات' },
    { id: 'list', icon: 'fa-list', label: 'قائمة' },
    { id: 'table', icon: 'fa-table', label: 'جدول' }
], className = '' }) => {
    return (
        <div className={`view-switcher ${className}`}>
            {options.map(option => (
                <button
                    key={option.id}
                    className={`view-btn ${view === option.id ? 'active' : ''}`}
                    onClick={() => onChange(option.id)}
                >
                    <i className={`fas ${option.icon}`}></i>
                    {option.label}
                </button>
            ))}
        </div>
    );
};

ViewSwitcher.propTypes = {
    view: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })),
    className: PropTypes.string
};
