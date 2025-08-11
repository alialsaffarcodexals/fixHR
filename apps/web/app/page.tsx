export default function Page(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Headcount</div>
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Departments</div>
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Payroll (fortnight)</div>
        <div className="p-4 rounded-2xl shadow bg-white dark:bg-gray-800">Next Run</div>
      </div>
    </div>
  )
}