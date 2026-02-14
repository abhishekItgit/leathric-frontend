import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { Button } from './Button';

export function Navbar() {
  const { token, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="text-xl font-extrabold tracking-wide text-leather-accent">
          LEATHRIC
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {['/', '/products', '/dashboard'].map((path, idx) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `text-sm ${isActive ? 'text-leather-accent' : 'text-stone-200 hover:text-white'}`
              }
            >
              {idx === 0 ? 'Home' : idx === 1 ? 'Shop' : 'Dashboard'}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full border border-white/15 p-2">
            <span className="text-sm">👜</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-leather-accent px-1.5 text-xs font-bold text-black">
                {cartCount}
              </span>
            )}
          </Link>
          {token ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-stone-300 sm:block">{user?.name || 'Member'}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
