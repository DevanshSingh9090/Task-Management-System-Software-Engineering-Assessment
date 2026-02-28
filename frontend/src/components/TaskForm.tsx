'use client';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function TaskForm({ onDone }: { onDone?: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Please enter a task title'); return; }
    setLoading(true);
    try {
      await api.post('/tasks', { title: title.trim(), description: description.trim() });
      toast.success('Task created! 🎉');
      setTitle('');
      setDescription('');
      onDone?.();
    } catch {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          Task Title *
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add more details... (optional)"
          className="input-field resize-none"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Adding...
          </>
        ) : (
          <><span className="text-base">+</span> Add Task</>
        )}
      </button>
    </form>
  );
}