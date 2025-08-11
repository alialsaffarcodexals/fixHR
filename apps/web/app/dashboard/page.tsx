import { api } from '../../lib/http';

export default async function Dashboard() {
  const [emps, depts, summary] = await Promise.all([
    api.get('/api/employees').then(r => r.data).catch(() => ({})),
    api.get('/api/departments').then(r => r.data).catch(() => []),
    api.get('/api/payroll/summary').then(r => r.data).catch(() => ({ lastRun: null, nextRun: null })),
  ]);
  const headcount = emps.total ?? (Array.isArray(emps) ? emps.length : (emps.items ? emps.items.length : 0));
  const deptCount = Array.isArray(depts) ? depts.length : 0;
  const last = summary.lastRun ? new Date(summary.lastRun).toISOString().slice(0,10) : 'N/A';
  const next = summary.nextRun ? new Date(summary.nextRun).toISOString().slice(0,10) : 'N/A';
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Headcount: {headcount}</div>
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Departments: {deptCount}</div>
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Last Payroll: {last}</div>
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Next Run: {next}</div>
      </div>
    </div>
  );
}
