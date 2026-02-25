import { Navigate, createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ShippingPage } from '../pages/legal/ShippingPage';
import { WarrantyPage } from '../pages/legal/WarrantyPage';
import { ContactPage } from '../pages/legal/ContactPage';
import { PrivacyPage } from '../pages/legal/PrivacyPage';
import { TermsPage } from '../pages/legal/TermsPage';
import { OurStoryPage } from '../pages/legal/OurStoryPage';
import { Shop } from '../features/products/pages/Shop';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <Shop /> },
      { path: 'products', element: <Navigate to="/shop" replace /> },
      { path: 'products/:id', element: <ProductDetailsPage /> },
      { path: 'shipping', element: <ShippingPage /> },
      { path: 'warranty', element: <WarrantyPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy-policy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'our-story', element: <OurStoryPage /> },
    ],
  },
  { path: '/signin', element: <LoginPage /> },
  { path: '/login', element: <Navigate to="/signin" replace /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/orders', element: <DashboardPage /> },
          { path: '/admin', element: <DashboardPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
