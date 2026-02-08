
import React from 'react';
import './AdvancedFilters.scss';
import PropTypes from 'prop-types';

export const AdvancedFilters = ({
    title = 'تصفية المهام',
    subtitle = 'اختر المعايير للبحث',
    activeFilters = [],
    onRemoveFilter,
    onReset,
    children, // Determine inputs via children or props. To keep it flexible, let's allow children for the grid.
    className = ''
}) => {
    return (
        <div className={`dir-task-filters ${className}`}>
            {/* Header */}
            <div className="dir-task-filters-header">
                <div className="dir-task-filters-title">
                    <div className="dir-task-filters-title-icon">
                        <i className="fas fa-sliders-h"></i>
                    </div>
                    <div>
                        <h3 className="filter-title-text">{title}</h3>
                        <p className="dir-task-filters-subtitle">{subtitle}</p>
                    </div>
                </div>
                <button className="btn-secondary-small" onClick={onReset}>
                    <i className="fas fa-redo"></i>
                    إعادة تعيين
                </button>
            </div>

            {/* Filter Chips */}
            {activeFilters.length > 0 && (
                <div className="dir-task-filter-chips">
                    {activeFilters.map((filter) => (
                        <span key={filter.id} className="dir-task-filter-chip">
                            {filter.icon && <i className={`fas ${filter.icon}`} style={{ color: filter.color }}></i>}
                            {filter.label}
                            <i
                                className="fas fa-times close-icon"
                                onClick={() => onRemoveFilter(filter.id)}
                            ></i>
                        </span>
                    ))}
                </div>
            )}

            {/* Filter Grid */}
            <div className="dir-task-filter-grid">
                {children}
            </div>
        </div>
    );
};

AdvancedFilters.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    activeFilters: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        color: PropTypes.string
    })),
    onRemoveFilter: PropTypes.func,
    onReset: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string
};

// Subcomponent for filter fields helper
export const FilterField = ({ label, children }) => (
    <div>
        <label className="dir-task-field-label">{label}</label>
        {children}
    </div>
);
