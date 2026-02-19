import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(form);
      setMessage('Account created successfully. You can now sign in.');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="panel w-full max-w-md space-y-5 p-8">
        <h1 className="text-3xl font-bold">Create account</h1>
        <Input label="fullName" required value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
        {message && <p className="text-sm text-emerald-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
        <p className="text-sm text-stone-400">
          Already have an account? <Link to="/login" className="text-leather-accent">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
