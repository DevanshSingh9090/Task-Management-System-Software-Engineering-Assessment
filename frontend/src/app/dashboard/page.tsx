'use client';
import { useState, useEffect } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const user = useAuthStore(s => s.user) as any;
  const router = useRouter();
  const [reloadKey, setReloadKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--brand)' }}
          />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const refreshTasks = () => setReloadKey(prev => prev + 1);

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            My Tasks
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Welcome back, <span className="font-semibold">{user.name || user.email}</span> 👋
          </p>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="btn-primary self-start sm:self-auto flex items-center gap-2"
        >
          <span className="text-lg leading-none">{formOpen ? '−' : '+'}</span>
          {formOpen ? 'Cancel' : 'New Task'}
        </button>
      </div>

      <div className={`grid gap-6 ${formOpen ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Task Form */}
        {formOpen && (
          <div className="lg:col-span-1 animate-slide-up">
            <div className="card p-5">
              <h2
                className="font-display font-bold text-base mb-4 flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs"
                  style={{ background: 'var(--brand)' }}
                >
                  +
                </span>
                New Task
              </h2>
              <TaskForm onDone={() => { refreshTasks(); setFormOpen(false); }} />
            </div>
          </div>
        )}

        {/* Task List */}
        <div className={formOpen ? 'lg:col-span-2' : 'col-span-1'}>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Task List
              </span>
            </div>
            <TaskList reloadKey={reloadKey} />
          </div>
        </div>
      </div>
    </div>
  );
}