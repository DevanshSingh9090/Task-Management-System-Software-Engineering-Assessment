'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import LogoutButton from './LogoutButton';

function ThemeToggle() {
  const { dark, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none"
      style={{
        background: dark ? 'var(--brand)' : 'var(--bg-tertiary)',
        border: '1.5px solid var(--border)',
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-300 shadow-sm"
        style={{
          left: dark ? '22px' : '2px',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        }}
      >
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

export default function Navbar() {
  const user = useAuthStore(s => s.user) as any;

  return (
    <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
      <div className="container mx-auto flex items-center justify-between px-4 py-3 max-w-6xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'var(--brand)' }}
          >
            T
          </div>
          <span className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            TaskFlow
          </span>
        </Link>

        {/* Right side */}
        <nav className="flex items-center gap-3">
          <ThemeToggle />

          {!user && (
            <>
              <Link href="/login" className="btn-ghost text-sm">Login</Link>
              <Link href="/register" className="btn-primary text-sm">Sign up</Link>
            </>
          )}

          {user && (
            <>
              <span
                className="text-sm hidden sm:block px-3 py-1 rounded-lg"
                style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
              >
                👋 {user.name || user.email}
              </span>
              <Link href="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
              <LogoutButton />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}