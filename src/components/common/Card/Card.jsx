
import React from 'react';
import './Card.scss';
import PropTypes from 'prop-types';
import { Badge } from '../Badge/Badge';
import { IconButton } from '../Button/Button';

export const TaskCard = ({
    title,
    description,
    date,
    user,
    priority = 'medium',
    status = 'pending',
    onView,
    onEdit,
    className = '',
    ...props
}) => {
    return (
        <div className={`task-card ${className}`} {...props}>
            <div className="task-card-header">
                <div className="task-card-badges">
                    <Badge variant={`priority-${priority}`}>
                        <i className="fas fa-exclamation-circle"></i>
                        {priority}
                    </Badge>
                    <Badge variant={`status-${status}`}>
                        <i className="fas fa-clock"></i>
                        {status}
                    </Badge>
                </div>
                <div className="task-card-actions">
                    <IconButton onClick={onView}>
                        <i className="fas fa-eye"></i>
                    </IconButton>
                    <IconButton onClick={onEdit}>
                        <i className="fas fa-edit"></i>
                    </IconButton>
                </div>
            </div>
            <h3 className="task-card-title">{title}</h3>
            <p className="task-card-description">{description}</p>
            <div className="task-card-meta">
                <div className="meta-item">
                    <i className="fas fa-calendar"></i>
                    <span>{date}</span>
                </div>
                <div className="meta-item">
                    <i className="fas fa-user"></i>
                    <span>{user}</span>
                </div>
            </div>
        </div>
    );
};

TaskCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string,
    user: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    className: PropTypes.string
};

export const StatCard = ({ label, value, icon: Icon, badges = [], className = '', style = {} }) => {
    return (
        <div className={`card stat-card ${className}`} style={style}>
            <div className="card-header">
                <span className="stat-label">{label}</span>
                {Icon && (
                    <div className="stat-icon">
                        {typeof Icon === 'string' ? <i className={`fas ${Icon}`}></i> : <Icon size={20} />}
                    </div>
                )}
            </div>
            <div className="stat-value">{value}</div>
            {badges.length > 0 && (
                <div className="stat-badges">
                    {badges.map((badge, index) => (
                        <Badge key={index} variant={badge.variant}>{badge.label}</Badge>
                    ))}
                </div>
            )}
        </div>
    );
};

StatCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
    badges: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        variant: PropTypes.string
    })),
    className: PropTypes.string,
    style: PropTypes.object
};

export const MetricCard = ({ label, value, icon: Icon, trend, trendValue, className = '', style = {} }) => {
    return (
        <div className={`card metric-card ${className}`} style={style}>
            <div className="card-header">
                <span className="metric-label">{label}</span>
                {Icon && (
                    <div className="metric-icon">
                        {typeof Icon === 'string' ? <i className={`fas ${Icon}`}></i> : <Icon size={20} />}
                    </div>
                )}
            </div>
            <div className="metric-content">
                <div className="metric-value">{value}</div>
                {trend && (
                    <div className={`metric-trend ${trend}`}>
                        <i className={`fas fa-arrow-${trend}`}></i>
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

MetricCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
    trend: PropTypes.oneOf(['up', 'down']),
    trendValue: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
};
