import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from '../components/Navbar';

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-leather-950 to-leather-900 text-stone-100">
      <Navbar />
      <main key={location.pathname} className="mx-auto w-full max-w-7xl px-4 py-8 animate-fadeInUp md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
