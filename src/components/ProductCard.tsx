import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    price?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, name, image }) => {
    return (
        <Link
            to={`/product/${id}`}
            className="catalog-item-link"
            data-testid={`product-card-${id}`}
        >
            <figure className="catalog-item">
                <img src={image} alt={name} />
                <figcaption>{name}</figcaption>
            </figure>
        </Link>
    );
};
