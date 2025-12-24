import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    to?: string;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    to,
    className = '',
    children,
    ...props
}) => {
    const baseClass = `btn ${variant} ${className}`;

    if (to) {
        return (
            <Link to={to} className={baseClass}>
                {children}
            </Link>
        );
    }

    return (
        <button className={baseClass} {...props}>
            {children}
        </button>
    );
};
