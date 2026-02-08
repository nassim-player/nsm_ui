
import React, { useState } from 'react';
import './Tabs.scss';
import PropTypes from 'prop-types';

export const Tabs = ({ tabs, defaultActive, className = '' }) => {
    const [activeTab, setActiveTab] = useState(defaultActive || (tabs[0] ? tabs[0].id : null));

    const handleTabClick = (id) => {
        setActiveTab(id);
    };

    const activeContent = tabs.find(t => t.id === activeTab)?.content;

    return (
        <div className={`tabs-container ${className}`}>
            <div className="tabs-header">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`director-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        {tab.icon && <i className={`fas ${tab.icon}`}></i>}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                {activeContent}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        content: PropTypes.node
    })).isRequired,
    defaultActive: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string
};
