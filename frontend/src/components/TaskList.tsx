'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import TaskEditModal from './TaskEditModal';

type Task = { id: number; title: string; description?: string; status: string };

function StatusBadge({ status }: { status: string }) {
  if (status === 'COMPLETED') return <span className="badge-completed">✅ Completed</span>;
  return <span className="badge-pending">⏳ Pending</span>;
}

function ToggleButton({ status, onClick }: { status: string; onClick: () => void }) {
  const isCompleted = status === 'COMPLETED';
  return (
    <button
      onClick={onClick}
      title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none"
      style={{ background: isCompleted ? '#10b981' : '#f59e0b' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
        style={{ transform: isCompleted ? 'translateX(24px)' : 'translateX(0)' }}
      />
    </button>
  );
}

export default function TaskList({ reloadKey }: { reloadKey: number }) {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks', {
        params: { page, limit: 10, search: search || undefined, status: status || undefined }
      });
      setTasks(res.data.data.tasks);
      setMeta(res.data.data.meta);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search, status, reloadKey]);

  const toggle = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`);
      toast.success(task.status === 'PENDING' ? 'Marked as completed! ✅' : 'Marked as pending ⏳');
      load();
    } catch {}
  };

  const remove = async (id: number) => {
    setDeletingId(id);
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      load();
    } catch {}
    finally { setDeletingId(null); }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>🔍</span>
          <input
            placeholder="Search tasks..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9 py-2.5"
          />
        </div>

        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="input-field py-2.5 sm:w-36"
        >
          <option value="">All tasks</option>
          <option value="PENDING">⏳ Pending</option>
          <option value="COMPLETED">✅ Completed</option>
        </select>

        {(search || status) && (
          <button
            onClick={() => { setSearch(''); setStatus(''); setPage(1); }}
            className="btn-ghost py-2.5 px-4 text-sm whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Stats */}
      {meta && (
        <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-medium">{meta.total} task{meta.total !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-4 animate-pulse h-20" style={{ background: 'var(--bg-tertiary)' }} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">{search || status ? '🔍' : '📝'}</div>
          <p className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
            {search || status ? 'No tasks match your filters' : 'No tasks yet'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {search || status ? 'Try a different search or filter' : 'Add your first task to get started!'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task.id}
              className="card p-4 flex items-start gap-4 group"
              style={{ opacity: task.status === 'COMPLETED' ? 0.85 : 1 }}
            >
              {/* Toggle */}
              <div className="mt-0.5">
                <ToggleButton status={task.status} onClick={() => toggle(task)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3
                      className="font-semibold text-sm leading-snug truncate"
                      style={{
                        color: 'var(--text-primary)',
                        textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
                        opacity: task.status === 'COMPLETED' ? 0.7 : 1,
                      }}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs mt-0.5 leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2">
                      <StatusBadge status={task.status} />
                    </div>
                  </div>

                  {/* Actions — appear on hover */}
                  <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                      title="Edit task"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => remove(task.id)}
                      disabled={deletingId === task.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                      title="Delete task"
                    >
                      {deletingId === task.id ? (
                        <span className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Page {meta.page} of {meta.pages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              disabled={page >= (meta.pages || 1)}
              onClick={() => setPage(p => p + 1)}
              className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onDone={load}
        />
      )}
    </>
  );
}