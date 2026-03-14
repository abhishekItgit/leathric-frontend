import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getApiErrorMessage } from '../utils/apiError';
import { useWishlist } from '../context/WishlistContext';

const getSafeRedirect = (redirect) => {
  if (!redirect || !redirect.startsWith('/')) {
    return '/';
  }

  if (redirect.startsWith('//')) {
    return '/';
  }

  return redirect;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const { refreshCart } = useCart();
  const { refreshWishlist } = useWishlist();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const authMessage = useMemo(
    () => location.state?.authMessage || '',
    [location.state]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(form);
      await Promise.all([refreshCart(), refreshWishlist()]);
      const redirect = getSafeRedirect(new URLSearchParams(location.search).get('redirect'));
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid credentials.'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="panel w-full max-w-md space-y-5 p-8">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        {authMessage ? <p className="text-sm text-amber-700">{authMessage}</p> : null}
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <p className="text-sm text-stone-600">
          New to Leathric? <Link to="/signup" className="text-leather-accent">Create account</Link>
        </p>
      </form>
    </main>
  );
}
