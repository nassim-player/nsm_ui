
import React, { useEffect, useRef } from 'react';
import { X } from 'react-feather';
import './Modal.scss';
import PropTypes from 'prop-types';

/**
 * A reusable Modal component with glassmorphism effects and smooth animations.
 */
export const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon: Icon,
    children,
    footer,
    size = 'medium', // small, medium, large, full
    className = '',
    closeOnOverlayClick = true,
    showCloseButton = true,
    glass = true,
    headerActions
}) => {
    const modalRef = useRef(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'is-open' : ''}`} onClick={handleOverlayClick}>
            <div
                className={`modal-container ${size} ${glass ? 'glass-effect' : ''} ${className}`}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        <div className="header-content">
                            {Icon && (
                                <div className="header-icon">
                                    <Icon size={20} />
                                </div>
                            )}
                            <div className="title-area">
                                {title && <h3>{title}</h3>}
                                {subtitle && <span className="subtitle">{subtitle}</span>}
                            </div>
                        </div>
                        <div className="header-actions">
                            {headerActions}
                            {showCloseButton && (
                                <button className="close-btn" onClick={onClose} aria-label="Close modal">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="modal-body custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.node,
    subtitle: PropTypes.node,
    icon: PropTypes.elementType,
    children: PropTypes.node,
    footer: PropTypes.node,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
    className: PropTypes.string,
    closeOnOverlayClick: PropTypes.bool,
    showCloseButton: PropTypes.bool,
    glass: PropTypes.bool,
    headerActions: PropTypes.node
};
