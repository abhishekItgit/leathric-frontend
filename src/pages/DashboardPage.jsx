import { useAuth } from '../hooks/useAuth';

const sampleOrders = [
  { id: 'LR-2840', date: '2026-01-10', total: 389, status: 'Delivered' },
  { id: 'LR-2751', date: '2025-12-04', total: 119, status: 'Shipped' },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="panel p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-stone-300">Welcome back, {user?.name || 'Leathric member'}.</p>
      </section>

      <section className="panel p-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <div className="mt-4 grid gap-2 text-sm text-stone-300">
          <p>Name: {user?.name || 'Not set'}</p>
          <p>Email: {user?.email || 'Not set'}</p>
          <p>Membership: Gold</p>
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-300">
            <thead>
              <tr className="border-b border-white/10 text-stone-400">
                <th className="py-2">Order #</th>
                <th className="py-2">Date</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/10">
                  <td className="py-3">{order.id}</td>
                  <td className="py-3">{order.date}</td>
                  <td className="py-3">${order.total}</td>
                  <td className="py-3 text-leather-accent">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
