import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Brand from '../components/Brand';
import Icon from '../components/Icon';
import Badge from '../components/Badge';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const roleLabel =
    user?.role === 'ADMIN'
      ? 'Administrator'
      : user?.role === 'OWNER'
        ? 'Store Owner'
        : 'Normal User';
  const go = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-section">
          <span className="sidebar-label">Workspace</span>
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" active={location.pathname === '/admin'} icon="grid">
              Overview
            </NavLink>
          )}
          {user?.role === 'USER' && (
            <NavLink to="/stores" active={location.pathname === '/stores'} icon="store">
              Stores
            </NavLink>
          )}
          {user?.role === 'OWNER' && (
            <NavLink to="/owner" active={location.pathname === '/owner'} icon="grid">
              Dashboard
            </NavLink>
          )}
          <NavLink
            to="/change-password"
            active={location.pathname === '/change-password'}
            icon="lock"
          >
            Security
          </NavLink>
        </div>
        <div className="sidebar-footer">
          <div className="user-mini">
            <span className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</span>
            <div>
              <strong>{user?.name}</strong>
              <small>{roleLabel}</small>
            </div>
          </div>
          <button className="logout-button" onClick={go}>
            <Icon name="logout" size={16} /> Sign out
          </button>
        </div>
      </aside>
      <div className="mobile-topbar">
        <Brand compact />
        <button className="mobile-menu" aria-label="Menu">
          <Icon name="menu" />
        </button>
      </div>
      <main className="main-content">
        <div className="mobile-userbar">
          <div>
            <span>{roleLabel}</span>
            <strong>{user?.name}</strong>
          </div>
          <button onClick={go}>
            <Icon name="logout" size={16} /> Sign out
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
function NavLink({ to, active, icon, children }) {
  return (
    <Link className={`nav-link ${active ? 'active' : ''}`} to={to}>
      <Icon name={icon} size={18} />
      <span>{children}</span>
    </Link>
  );
}
