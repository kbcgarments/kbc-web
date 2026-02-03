export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-primary p-6 rounded-lg border border-primary">
          <h3 className="text-sm text-secondary mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-primary">1,234</p>
        </div>
        <div className="bg-primary p-6 rounded-lg border border-primary">
          <h3 className="text-sm text-secondary mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-primary">$45,678</p>
        </div>
        <div className="bg-primary p-6 rounded-lg border border-primary">
          <h3 className="text-sm text-secondary mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-primary">567</p>
        </div>
      </div>

      <div className="bg-primary p-6 rounded-lg border border-primary">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Recent Orders
        </h2>
        <p className="text-secondary">Order list coming soon...</p>
      </div>
    </div>
  );
}
