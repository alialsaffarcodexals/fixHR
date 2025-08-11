'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/http';

export default function Employees() {
  const [data, setData] = useState<any>({ items: [] });
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/employees', { params: { page, query } });
      setData(res.data);
    } catch (e) {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, query]);

  const items = data.items || data;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Employees</h1>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border rounded px-2 py-1"
        />
        <button onClick={() => setPage(1)} className="px-3 py-1 bg-blue-600 text-white rounded">Search</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="overflow-auto rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Employee ID</th>
                <th className="p-2 text-left">Pay Scale</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e: any) => (
                <tr key={e.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2">{e.lastName}, {e.firstName}</td>
                  <td className="p-2">{e.employeeId}</td>
                  <td className="p-2">{e.payScale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 border rounded">Prev</button>
        <span>Page {data.page || page}</span>
        <button disabled={items.length < (data.pageSize || 20)} onClick={() => setPage(p => p + 1)} className="px-2 py-1 border rounded">Next</button>
      </div>
    </div>
  );
}
