'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Account created! Please log in. 🎉');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
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
              Create your account
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Start managing tasks in seconds
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field pr-12"
                  required
                  minLength={6}
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
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: password.length >= i * 3
                          ? (password.length >= 9 ? '#10b981' : password.length >= 6 ? '#f59e0b' : '#ef4444')
                          : 'var(--border)'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create account →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--brand)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}