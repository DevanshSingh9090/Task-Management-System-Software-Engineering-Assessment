'use client';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function TaskForm({ onDone }: { onDone?: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const submit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { title, description });
      toast.success('Task created');
      setTitle(''); setDescription('');
      onDone?.();
    } catch (err) {}
  };
  return (
    <form onSubmit={submit} className="space-y-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded"/>
      <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded"/>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Task</button>
    </form>
  );
}
