import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('../features/products/pages/Shop').then((m) => ({ default: m.Shop })));
const ProductDetailsPage = lazy(() =>
  import('../pages/ProductDetailsPage').then((m) => ({ default: m.ProductDetailsPage }))
);
const CartPage = lazy(() => import('../pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() =>
  import('../pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const DashboardPage = lazy(() =>
  import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('../pages/SignupPage').then((m) => ({ default: m.SignupPage })));

export function AppRouter() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><LoadingSkeleton className="h-[60vh]" /></div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ShopPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/login" element={<Navigate to="/signin" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
