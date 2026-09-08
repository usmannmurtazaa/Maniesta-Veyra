import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { Badge } from '@/components/ui/badge';

export default async function AdminGarmentsPage() {
  await requireAdmin();
  const garments = await adminService.listGarments();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Garments</h1>
      <div className="overflow-x-auto border border-mv-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-mv-bg-alt">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Base Price</th>
              <th className="p-3 text-left">Print Locations</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {garments.map((garment) => (
              <tr key={garment.id} className="border-t border-mv-border">
                <td className="p-3">{garment.name}</td>
                <td className="p-3">₨ {Number(garment.basePrice).toLocaleString()}</td>
                <td className="p-3">{garment.supportedPrintLocations.join(', ')}</td>
                <td className="p-3"><Badge variant={garment.isActive ? 'success' : 'error'}>{garment.isActive ? 'Active' : 'Inactive'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}