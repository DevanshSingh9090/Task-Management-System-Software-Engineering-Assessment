'use client';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s: any) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.data.user);
      toast.success('Welcome back! 👋');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
              style={{ background: 'var(--brand)' }}
            >
              T
            </div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your TaskFlow account
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign in →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold" style={{ color: 'var(--brand)' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}