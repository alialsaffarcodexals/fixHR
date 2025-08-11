'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/http';

export default function Departments() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignInput, setAssignInput] = useState<Record<string,string>>({});
  const [headInput, setHeadInput] = useState<Record<string,string>>({});

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/departments');
      const depts = res.data;
      const withEmployees = await Promise.all(
        depts.map(async (d: any) => {
          const emp = await api.get(`/api/departments/${d.id}/employees`).then(r => r.data);
          return { ...d, employees: emp };
        })
      );
      setData(withEmployees);
    } catch (e) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const assign = async (id: string) => {
    try {
      await api.post(`/api/departments/${id}/assign`, { employeeId: assignInput[id] });
      setAssignInput({ ...assignInput, [id]: '' });
      load();
    } catch (e) {
      alert('Assign failed');
    }
  };

  const setHead = async (id: string) => {
    try {
      await api.post(`/api/departments/${id}/set-head`, { employeeId: headInput[id] });
      setHeadInput({ ...headInput, [id]: '' });
      load();
    } catch (e) {
      alert('Set head failed');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold mb-4">Departments</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && data.map((d) => (
        <div key={d.id} className="border rounded-2xl p-4 space-y-2">
          <h2 className="font-semibold">{d.name} <span className="text-sm text-gray-500">({d.location})</span></h2>
          <ul className="list-disc ml-6">
            {d.employees.map((e: any) => (
              <li key={e.id}>{e.firstName} {e.lastName}{e.isHead && ' (Head)'}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <input
              value={assignInput[d.id] || ''}
              onChange={(e) => setAssignInput({ ...assignInput, [d.id]: e.target.value })}
              placeholder="Employee ID"
              className="border rounded px-2 py-1"
            />
            <button onClick={() => assign(d.id)} className="px-3 py-1 bg-blue-600 text-white rounded">Assign</button>
            <input
              value={headInput[d.id] || ''}
              onChange={(e) => setHeadInput({ ...headInput, [d.id]: e.target.value })}
              placeholder="Head ID"
              className="border rounded px-2 py-1"
            />
            <button onClick={() => setHead(d.id)} className="px-3 py-1 bg-green-600 text-white rounded">Set Head</button>
          </div>
        </div>
      ))}
    </div>
  );
}
