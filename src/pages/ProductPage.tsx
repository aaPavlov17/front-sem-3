import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchCatalog } from '../store/slices/catalogSlice';
import { addToCart } from '../store/slices/cartSlice';

function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { items, loading } = useAppSelector((state) => state.catalog);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchCatalog());
        }
    }, [dispatch, items.length]);

    const productId = Number(id);
    const product = items.find((item) => item.id === productId);

    if (loading && !product) {
        return (
            <main className="product-page">
                <div className="product-page-inner">Загрузка товара...</div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-page">
                <div className="product-page-inner">
                    <p>Товар не найден.</p>
                    <Link to="/" className="product-back-link">
                        Вернуться в каталог
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="product-page">
            <div className="product-page-inner">
                <Link to="/" className="product-back-link">
                    ← Назад к каталогу
                </Link>
                <div className="product-card">
                    <div className="product-image-wrapper">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info">
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-description">
                            {product.description || 'Описание товара.'}
                        </p>
                        <p className="product-price">
                            Price: {product.price} руб.
                        </p>
                        <button
                            className="btn secondary product-add-btn"
                            type="button"
                            onClick={() =>
                                dispatch(
                                    addToCart({
                                        id: product.id,
                                        name: product.name,
                                        image: product.image,
                                        price: product.price,
                                        description: product.description,
                                        quantity: 1
                                    })
                                )
                            }
                        >
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProductPage;
