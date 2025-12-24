import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { submitAuth } from '../store/slices/authSlice';

function AuthPage() {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await dispatch(submitAuth(formData)).unwrap();
            alert('Авторизация успешна!');
            navigate('/');
        } catch (err) {
            console.error('Auth error:', err);
        }
    };

    return (
        <main>
            <section className="auth-section" aria-labelledby="authTitle">
                <div className="auth-overlay"></div>
                <h2 id="authTitle" className="auth-title">Вход</h2>

                <div className="auth-nav-link">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="auth-label" htmlFor="authEmail">
                        Email:
                    </label>
                    <input
                        id="authEmail"
                        name="email"
                        type="email"
                        className="auth-input"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

                    <label className="auth-label" htmlFor="authPassword">
                        Пароль:
                    </label>
                    <input
                        id="authPassword"
                        name="password"
                        type="password"
                        className="auth-input"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

                    {error && <div className="auth-error">{error}</div>}

                    <button
                        type="submit"
                        className="auth-submit-btn btn secondary"
                        disabled={loading}
                    >
                        {loading ? 'Отправка...' : 'Войти'}
                    </button>

                    <div className="auth-nav-link">
                        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default AuthPage;
