import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/" aria-label="На главную">
          <img className="footer-logo" src="/assets/logotype.svg" alt="Логотип" />
        </Link>
        <div className="contacts">
          Контакты:<br />tg: @...
        </div>
        <div className="footer-auth-buttons">
          <Link className="btn secondary" to="/auth">
            Войти
          </Link>
          <Link className="btn secondary" to="/register">
            Регистрация
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer





