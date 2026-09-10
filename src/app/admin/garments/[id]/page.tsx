import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { GarmentForm } from '@/components/admin/garment-form';
import { notFound } from 'next/navigation';

interface AdminGarmentEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminGarmentEditPage({ params }: AdminGarmentEditPageProps) {
  await requireAdmin();
  const { id } = await params;

  const garments = await adminService.listGarments();
  const garment = garments.find((g) => g.id === id);
  if (!garment) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Edit Garment</h1>
      <GarmentForm garment={garment} />
    </div>
  );
}