import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-text">FoodstaGram</span>
          </Link>
          
          <ul className="navbar-nav">
            <li>
              <Link to="/" className="navbar-link">
                Home
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/create" className="navbar-link">
                    Create Recipe
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="navbar-link">
                    My Recipes
                  </Link>
                </li>
                <li>
                  <span className="navbar-user">Hi, {user?.name}</span>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="navbar-btn"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="navbar-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="navbar-btn navbar-btn-outline">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;