import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { registerUser } from '../store/slices/authSlice';

function RegisterPage() {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [validationError, setValidationError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setValidationError('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();


        if (!formData.name || !formData.email || !formData.password) {
            setValidationError('Все поля обязательны');
            return;
        }

        if (formData.password.length < 6) {
            setValidationError('Пароль должен быть минимум 6 символов');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Пароли не совпадают');
            return;
        }

        try {
            await dispatch(registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })).unwrap();
            alert('Регистрация успешна!');
            navigate('/');
        } catch (err: any) {
            setValidationError(err.message);
        }
    };

    return (
        <main>
            <section className="auth-section" aria-labelledby="registerTitle">
                <div className="auth-overlay"></div>
                <h2 id="registerTitle" className="auth-title">Регистрация</h2>

                <div className="auth-nav-link">
                    Уже есть аккаунт? <Link to="/auth">Войти</Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="auth-label" htmlFor="registerName">
                        Введите имя:
                    </label>
                    <input
                        id="registerName"
                        name="name"
                        type="text"
                        className="auth-input"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

                    <label className="auth-label" htmlFor="registerEmail">
                        Введите email:
                    </label>
                    <input
                        id="registerEmail"
                        name="email"
                        type="email"
                        className="auth-input"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />

                    <label className="auth-label" htmlFor="registerPassword">
                        Введите пароль:
                    </label>
                    <input
                        id="registerPassword"
                        name="password"
                        type="password"
                        className="auth-input"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        minLength={6}
                    />

                    <label className="auth-label" htmlFor="registerConfirmPassword">
                        Подтвердите пароль:
                    </label>
                    <input
                        id="registerConfirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="auth-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        minLength={6}
                    />

                    {(error || validationError) && (
                        <div className="auth-error">{validationError || error}</div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-btn btn secondary"
                        disabled={loading}
                    >
                        {loading ? 'Отправка...' : 'Зарегистрироваться'}
                    </button>

                    <div className="auth-nav-link">
                        Уже есть аккаунт? <Link to="/auth">Войти</Link>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default RegisterPage;
