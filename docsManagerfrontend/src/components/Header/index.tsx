import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LABEL_HEADER } from "./constants";
import './style.css';

const Header = () => {
  const { user, logout, isAuthenticated, login } = useAuth();

  return (
    <nav className="navbar">
      <div className="sub-nav">
        <NavLink to="/">{LABEL_HEADER.HOME}</NavLink>
        <NavLink to="/pool">{LABEL_HEADER.POOL}</NavLink>
      </div>

      {isAuthenticated ? (
        <>
          <NavLink to="/profil">{LABEL_HEADER.PROFIL}</NavLink>

          <div className="navbar-right">
            <span className="navbar-user">
              👤 {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
            </span>
            <button onClick={logout} className="navbar-logout">
              Déconnexion
            </button>
          </div>
        </>
      ) : (
        <div className="sub-nav">
          <button onClick={login} className="navbar-login">
            Se connecter
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;
