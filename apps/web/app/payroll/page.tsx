'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Payroll(){
  const [preview,setPreview]=useState('');
  async function run() {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      'http://localhost:4000';
    const r = await axios.post(
      `${base}/api/payroll/run`,
      {},
      { headers: { Authorization: 'Bearer dev' } }
    );
    setPreview(r.data.preview);
  }
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Payroll</h1>
      <button onClick={run} className="px-4 py-2 rounded-2xl bg-blue-600 text-white">Run Payroll</button>
      <textarea className="w-full h-96 p-2 rounded-2xl border" value={preview} readOnly />
    </div>
  )
}