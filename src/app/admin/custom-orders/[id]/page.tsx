import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { UpdateCustomOrderStatusForm } from '@/components/admin/update-custom-order-status-form';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';

export default async function AdminCustomOrderDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const tracking = await adminService.getCustomOrder(params.id);
  if (!tracking) notFound();

  const design = tracking.orderItem.customDesign;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-4">Custom Order Review</h1>
      <div className="mb-6"><Badge>{tracking.status.replace(/_/g, ' ')}</Badge></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-mv-border rounded-lg p-4">
            <h2 className="font-semibold mb-2">Design Details</h2>
            <p>Garment: {design?.garment.name}</p>
            <p>Color: {design?.color.name}</p>
            <p>Size: {design?.size.label}</p>
            <p>Print Locations: {design?.printLocations.join(', ')}</p>
            <p>Quantity: {design?.quantity}</p>
            {design?.notes && <p className="mt-2">Notes: {design.notes}</p>}
          </div>
          <div className="border border-mv-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Artwork</h3>
            {design?.assets.map((asset) => (
              <div key={asset.id} className="mb-4">
                <p className="text-sm font-medium">{asset.printLocation}</p>
                <img src={asset.imageUrl} alt={asset.printLocation} className="max-w-xs h-40 object-contain border border-mv-border rounded" />
                <p className="text-xs text-mv-muted">Position: x {asset.positionX}, y {asset.positionY}, scale {asset.scale}, rotation {asset.rotation}°</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <UpdateCustomOrderStatusForm trackingId={tracking.id} currentStatus={tracking.status} />
        </div>
      </div>
    </div>
  );
}