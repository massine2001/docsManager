import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LABEL_HEADER } from "./constants";
import './style.css';
import { useMediaQuery } from "../../hooks/useMediaQuery";

const Header = () => {
  const { user, logout, isAuthenticated, login } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <nav className="navbar">
      <div className="sub-nav">
      {isDesktop && 
        <div className="brand">
            <svg className="brand-logo" viewBox="0 0 32 32" aria-hidden="true">
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--primary-500)"/>
                  <stop offset="1" stopColor="var(--accent-500)"/>
                </linearGradient>
              </defs>
              <rect x="2" y="6" width="28" height="20" rx="6" fill="url(#brandGrad)"/>
              <rect x="7" y="11" width="18" height="10" rx="3" fill="#fff"/>
              <rect x="11" y="14" width="10" height="4" rx="2" fill="url(#brandGrad)"/>
            </svg>
            <span className="brand-name">DocsManager</span>
          </div>
        }
        <NavLink to="/">{LABEL_HEADER.HOME}</NavLink>
        <NavLink to="/pool">{LABEL_HEADER.POOL}</NavLink>
      </div>

      {isAuthenticated ? (
        <>
          <NavLink to="/profil">{LABEL_HEADER.PROFIL}</NavLink>

          <div className="navbar-right">
            {isDesktop && 
            <span className="navbar-user">
              👤 {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
            </span>
            }
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
