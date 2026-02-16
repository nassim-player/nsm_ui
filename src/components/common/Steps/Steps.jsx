
import React from 'react';
import { Check } from 'react-feather';
import './Steps.scss';
import PropTypes from 'prop-types';

/**
 * A horizontal or vertical step indicator.
 */
export const Steps = ({
    steps,
    currentStepIndex,
    direction = 'horizontal', // horizontal, vertical
    variant = 'default', // default, on-primary
    className = ''
}) => {
    return (
        <div className={`steps-container ${direction} variant-${variant} ${className}`}>
            {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                    <div
                        key={step.id || index}
                        className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                        <div className="step-point-wrapper">
                            <div className="step-point">
                                {isCompleted ? <Check size={14} /> : <span>{index + 1}</span>}
                            </div>
                            {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                        <div className="step-content">
                            <span className="step-label">{step.label}</span>
                            {step.description && <span className="step-desc">{step.description}</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

Steps.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.node.isRequired,
        description: PropTypes.node
    })).isRequired,
    currentStepIndex: PropTypes.number.isRequired,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    className: PropTypes.string
};
