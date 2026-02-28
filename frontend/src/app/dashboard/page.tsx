'use client';

import { useState, useEffect } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const router = useRouter();
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) {
    return <div className="text-center py-20">Redirecting...</div>;
  }

  const refreshTasks = () => {
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Add Task</h2>
        <TaskForm onDone={refreshTasks} />
      </div>

      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Tasks</h2>
        <TaskList reloadKey={reloadKey} />
      </div>
    </div>
  );
}