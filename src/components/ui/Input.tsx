import React, { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = false,
    className = '',
    id,
    ...props
}) => {
    return (
        <div className={`input-container ${fullWidth ? 'full-width' : ''} ${className}`}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                id={id}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};
