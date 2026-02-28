'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

type Task = { id: number; title: string; description?: string; status: string };

export default function TaskEditModal({
  task,
  onClose,
  onDone,
}: {
  task: Task;
  onClose: () => void;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      await api.patch(`/tasks/${task.id}`, { title: title.trim(), description: description.trim(), status });
      toast.success('Task updated ✨');
      onDone();
      onClose();
    } catch {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md animate-scale-in card p-6" style={{ background: 'var(--bg-secondary)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Title *
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              className="input-field"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="input-field resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
              Status
            </label>
            <div className="flex gap-2">
              {['PENDING', 'COMPLETED'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border"
                  style={{
                    background: status === s
                      ? s === 'COMPLETED' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'
                      : 'var(--bg-tertiary)',
                    borderColor: status === s
                      ? s === 'COMPLETED' ? '#10b981' : '#f59e0b'
                      : 'var(--border)',
                    color: status === s
                      ? s === 'COMPLETED' ? '#10b981' : '#d97706'
                      : 'var(--text-secondary)',
                  }}
                >
                  {s === 'COMPLETED' ? '✅ Completed' : '⏳ Pending'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 py-2.5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}