'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employees(){
  const [data,setData]=useState<any>({items:[]});
  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      'http://localhost:4000';
    axios
      .get(`${base}/api/employees`, {
        headers: { Authorization: 'Bearer dev' },
      })
      .then((r) => setData(r.data))
      .catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Employees</h1>
      <div className="overflow-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Employee ID</th><th className="p-2 text-left">Pay Scale</th></tr>
          </thead>
          <tbody>
            {data.items.map((e:any)=>(
              <tr key={e.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2">{e.lastName}, {e.firstName}</td>
                <td className="p-2">{e.employeeId}</td>
                <td className="p-2">{e.payScale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}