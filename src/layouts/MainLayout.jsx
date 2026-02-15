import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from './Footer';
import { Header } from '../components/Header';

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#EDEDED]">
      <Header />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
