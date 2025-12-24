import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCatalog } from '../store/slices/catalogSlice';
import { ProductCard } from './ProductCard';

function Catalog() {
    const dispatch = useAppDispatch();
    const { items, loading, error } = useAppSelector((state) => state.catalog);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchCatalog());
        }
    }, [dispatch, items.length]);

    if (loading) {
        return (
            <section className="catalog">
                <div className="catalog-overlay"></div>
                <h2 className="catalog-title">Каталог</h2>
                <div className="catalog-grid">Загрузка...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="catalog">
                <div className="catalog-overlay"></div>
                <h2 className="catalog-title">Каталог</h2>
                <div className="catalog-grid">Ошибка: {error}</div>
            </section>
        );
    }

    return (
        <section className="catalog">
            <div className="catalog-overlay"></div>
            <h2 className="catalog-title">Каталог</h2>
            <div className="catalog-grid">
                {items.map((item) => (
                    <ProductCard key={item.id} id={item.id} name={item.name} image={item.image} />
                ))}
            </div>
        </section>
    );
}

export default Catalog;
