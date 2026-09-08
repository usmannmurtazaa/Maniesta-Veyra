import { put, del } from '@vercel/blob';

export async function uploadToPublicBucket(
  file: File,
  folder: string = 'products'
): Promise<{ url: string; pathname: string }> {
  const { url, pathname } = await put(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: true,
  });
  return { url, pathname };
}

export async function uploadToPrivateBucket(
  file: File,
  folder: string = 'customer-designs'
): Promise<{ url: string; pathname: string }> {
  const { url, pathname } = await put(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
    access: 'private',
    addRandomSuffix: true,
  });
  return { url, pathname };
}

export async function deleteFromStorage(url: string): Promise<void> {
  await del(url);
}