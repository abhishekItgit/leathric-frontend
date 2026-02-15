import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getApiErrorMessage } from '../utils/apiError';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const { refreshCart } = useCart();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(form);
      await refreshCart();
      const redirect = new URLSearchParams(location.search).get('redirect');
      navigate(redirect || '/');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid credentials.'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="panel w-full max-w-md space-y-5 p-8">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <p className="text-sm text-stone-400">
          New to Leathric? <Link to="/signup" className="text-leather-accent">Create account</Link>
        </p>
      </form>
    </main>
  );
}
