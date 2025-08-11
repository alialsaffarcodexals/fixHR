'use client';
import { useState } from 'react';
import { api } from '../../lib/http';

export default function Payroll() {
  const [preview, setPreview] = useState('');
  const [runId, setRunId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/payroll/run', {});
      setPreview(res.data.preview);
      setRunId(res.data.runId);
    } catch (e) {
      setError('Run failed');
    } finally {
      setLoading(false);
    }
  };

  const base = process.env.API_BASE_URL || 'http://localhost:4000';

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Payroll</h1>
      <button onClick={run} disabled={loading} className="px-4 py-2 rounded-2xl bg-blue-600 text-white">
        {loading ? 'Running...' : 'Run Payroll'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
      {runId && (
        <a
          href={`${base}/api/payroll/${runId}/report`}
          className="block text-blue-600 underline"
          target="_blank"
        >
          Download payroll.txt
        </a>
      )}
      <textarea className="w-full h-96 p-2 rounded-2xl border" value={preview} readOnly />
    </div>
  );
}
