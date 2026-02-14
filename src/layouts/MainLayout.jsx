import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-leather-950 to-leather-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
