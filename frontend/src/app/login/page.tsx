'use client';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s: any) => s.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', {
        email,
        password
      });

      toast.success('Login successful');
      router.push('/dashboard');

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Login failed'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded"/>
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded"/>
        <button className="w-full bg-green-600 text-white p-2 rounded">Login</button>
      </form>
      <p className="text-sm mt-3">Don't have an account? <a href="/register" className="text-blue-600">Sign up</a></p>
    </div>
  );
}