import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logout } from '../store/slices/authSlice';

function Header() {
    const dispatch = useAppDispatch();
    const totalItems = useAppSelector((state) =>
        state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
    );
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    return (
        <header className="header">
            <Link to="/" aria-label="На главную">
                <img className="logotype" src="/assets/logotype.svg" alt="Логотип" />
            </Link>
            <div className="header-actions">
                <Link className="cart-link" to="/cart">
                    Корзина
                    <span className="cart-count">{totalItems}</span>
                </Link>
                {isAuthenticated && user?.name ? (
                    <>
                        <span className="header-username">{user.name}</span>
                        <button
                            type="button"
                            className="btn secondary header-logout-btn"
                            onClick={() => dispatch(logout())}
                        >
                            Выйти
                        </button>
                    </>
                ) : (
                    <>
                        <Link className="btn secondary" to="/auth">
                            Войти
                        </Link>
                        <Link className="btn secondary" to="/register">
                            Регистрация
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
