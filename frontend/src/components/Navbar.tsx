'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          Task Manager
        </Link>

        <nav className="flex items-center gap-3">
          {!user && (
            <>
              <Link href="/login" className="px-4 py-2 rounded border">
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Sign up
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded border"
              >
                Dashboard
              </Link>

              <LogoutButton />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}