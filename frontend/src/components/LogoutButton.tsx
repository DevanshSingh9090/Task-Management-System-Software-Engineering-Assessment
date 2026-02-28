'use client';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LogoutButton() {
  const router = useRouter();
  const clearUser = useAuthStore((s: any) => s.clearUser);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    finally {
      clearUser();
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  return (
    <button onClick={handleLogout} className="btn-danger">
      Logout
    </button>
  );
}