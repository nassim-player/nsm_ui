
import React from 'react';
import './Form.scss';
import PropTypes from 'prop-types';

export const InputField = ({ label, id, className = '', type = 'text', ...props }) => {
    return (
        <div className={`input-field ${className}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <input type={type} id={id} {...props} />
        </div>
    );
};

InputField.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    type: PropTypes.string
};

export const SelectField = ({ label, id, children, className = '', ...props }) => {
    return (
        <div className={`input-field ${className}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <select id={id} {...props}>
                {children}
            </select>
        </div>
    );
};

SelectField.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.string
};

export const TextArea = ({ label, id, className = '', ...props }) => {
    return (
        <div className={`input-field ${className}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <textarea id={id} {...props}></textarea>
        </div>
    );
};

TextArea.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    className: PropTypes.string
};

export const DatePicker = ({ label, id, className = '', ...props }) => {
    return (
        <div className={`input-field ${className}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <input type="date" id={id} {...props} />
        </div>
    );
};

DatePicker.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    className: PropTypes.string
};
