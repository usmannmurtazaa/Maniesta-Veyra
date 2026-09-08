import { requireAdmin } from '@/lib/auth/guards';
import { adminService } from '@/lib/services/admin-service';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await adminService.getSettings();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}