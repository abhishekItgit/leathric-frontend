import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import leathricHorseLogo from '../assets/leathric-horse-logo.svg';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/products' },
  { label: 'Our Story', path: '/our-story' },
  { label: 'Dashboard', path: '/dashboard' },
];

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 border-b border-white/10 transition-all duration-300 ${
        isScrolled ? 'bg-black/75 py-2 backdrop-blur-xl' : 'bg-transparent py-4'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="inline-flex items-center" aria-label="Leathric Home">
          <img src={leathricHorseLogo} alt="Leathric horse logo" className="h-10 w-auto md:h-11" loading="eager" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="group relative text-sm text-stone-200 hover:text-white">
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#C8A36A] transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative rounded-full border border-white/15 px-3 py-2 text-sm text-[#EDEDED]">
            Cart
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 rounded-full bg-[#C8A36A] px-1.5 text-[10px] font-bold text-black">{cartCount}</span>
            ) : null}
          </Link>
          {isAuthenticated() ? (
            <button onClick={handleLogout} className="rounded-full border border-white/20 px-4 py-2 text-sm text-stone-200 hover:border-[#C8A36A] hover:text-white">
              {user?.name ? `${user.name.split(' ')[0]} · Logout` : 'Profile · Logout'}
            </button>
          ) : (
            <Link to="/signin" className="rounded-full bg-[#C8A36A] px-4 py-2 text-sm font-semibold text-black">Sign In</Link>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
