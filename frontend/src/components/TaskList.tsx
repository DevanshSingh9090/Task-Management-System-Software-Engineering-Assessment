'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

type Task = { id:number; title:string; description?:string; status:string };

export default function TaskList({ reloadKey }: { reloadKey: number }) {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  useEffect(() => { if (!user) router.push('/login'); }, [user, router]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [meta, setMeta] = useState<any>(null);

  const load = async () => {
    try {
      const res = await api.get('/tasks', { params: { page, limit: 10, search: search || undefined, status: status || undefined }});
      setTasks(res.data.data.tasks);
      setMeta(res.data.data.meta);
    } catch (err) {}
  };

  useEffect(() => {
  load();
}, [page, search, status, reloadKey]);

  const toggle = async (id:number) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      toast.success('Toggled');
      load();
    } catch (err) {}
  };

  const remove = async (id:number) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Deleted');
      load();
    } catch (err) {}
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input placeholder="Search title" value={search} onChange={e=>{setSearch(e.target.value); setPage(1);}} className="p-2 border rounded flex-1"/>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="p-2 border rounded">
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button onClick={()=>{ setSearch(''); setStatus(''); setPage(1); }} className="px-3 py-2 border rounded">Reset</button>
      </div>

      <ul className="space-y-3">
        {tasks.map(t => (
          <li key={t.id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{t.title}</h3>
              {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
              <p className="text-xs mt-1">{t.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>toggle(t.id)} className="px-3 py-1 bg-yellow-300 rounded">Toggle</button>
              <button onClick={()=>remove(t.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-4">
        <div>Page {meta?.page ?? 1} / {meta?.pages ?? 1}</div>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded">Prev</button>
          <button disabled={page >= (meta?.pages || 1)} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
