'use client';

import { useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function BootstrapAuth() {
  const setUser = useAuthStore((s: any) => s.setUser);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data.user);
      } catch {
        // silent fail (not logged in)
      }
    };

    loadUser();
  }, [setUser]);

  return null;
}