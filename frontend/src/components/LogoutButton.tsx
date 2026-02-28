'use client';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LogoutButton() {
  const router = useRouter();
  const clearUser = useAuthStore((s:any) => s.clearUser);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore errors, continue to clear client
    } finally {
      clearUser();
      toast.success('Logged out');
      router.push('/');
    }
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 rounded bg-red-500 text-white">
      Logout
    </button>
  );
}