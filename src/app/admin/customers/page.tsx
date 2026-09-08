import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  await requireAdmin();
  const page = Number(searchParams.page || 1);
  const search = searchParams.search;
  const { data: customers, pagination } = await adminService.listCustomers(page, 20, search);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Customers</h1>
      <div className="overflow-x-auto border border-mv-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-mv-bg-alt">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-mv-border">
                <td className="p-3">{customer.firstName} {customer.lastName}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer._count.orders}</td>
                <td className="p-3">{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}