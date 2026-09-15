import { fileTypeFromBuffer } from 'file-type';
import sizeOf from 'image-size';
import { sanitizeSvg, isValidSvg } from '@/lib/security/svg-sanitize';

const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
]);
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg']);

// Keep this in sync with:
//   - src/app/api/custom/upload/route.ts  (MAX_UPLOAD_BYTES)
//   - src/components/customizer/design-uploader.tsx  (UI hint text)
//
// Why 5 MB (not 10 MB): Netlify's default function body limit is 6 MB.
// Requests larger than that fail at the network layer before our code runs,
// producing the misleading `ERR_SOCKET_NOT_CONNECTED` error.
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 5000;

export async function validateUpload(file: File): Promise<{
  valid: boolean;
  error?: string;
  dimensions?: { width: number; height: number };
}> {
  // ---- Size check ----
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5 MB limit' };
  }

  // ---- Extension check ----
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: 'Invalid file type' };
  }

  // ---- Magic-byte check ----
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType || !ALLOWED_MIME_TYPES.has(fileType.mime)) {
    return { valid: false, error: 'File content does not match extension' };
  }

  // ---- SVG: sanitize and verify shape ----
  if (fileType.mime === 'image/svg+xml') {
    const svgString = buffer.toString('utf8');
    const sanitized = sanitizeSvg(svgString);
    if (!isValidSvg(sanitized)) {
      return { valid: false, error: 'Invalid or unsafe SVG content' };
    }
    return { valid: true };
  }

  // ---- Raster: check dimensions ----
  try {
    const dims = sizeOf(buffer);
    if (
      !dims.width ||
      !dims.height ||
      dims.width < MIN_DIMENSION ||
      dims.height < MIN_DIMENSION ||
      dims.width > MAX_DIMENSION ||
      dims.height > MAX_DIMENSION
    ) {
      return {
        valid: false,
        error: `Image dimensions must be between ${MIN_DIMENSION}×${MIN_DIMENSION} and ${MAX_DIMENSION}×${MAX_DIMENSION}`,
      };
    }
    return {
      valid: true,
      dimensions: { width: dims.width, height: dims.height },
    };
  } catch {
    return { valid: false, error: 'Unable to read image dimensions' };
  }
}