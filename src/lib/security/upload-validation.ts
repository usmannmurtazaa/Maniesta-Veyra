import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 5000;

export async function validateUpload(file: File): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10 MB limit' };
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: 'Invalid file type' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Detect actual MIME from magic bytes
  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType || !ALLOWED_MIME_TYPES.has(fileType.mime)) {
    return { valid: false, error: 'File content does not match extension' };
  }

  if (fileType.mime === 'image/svg+xml') {
    const svgString = buffer.toString('utf8');
    const sanitized = DOMPurify.sanitize(svgString, {
      USE_PROFILES: { svg: true, svgFilters: true },
      FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onload', 'onclick', 'onerror', 'href', 'xlink:href'],
    });
    if (!sanitized.includes('<svg')) {
      return { valid: false, error: 'Invalid SVG content' };
    }
    return { valid: true };
  } else {
    try {
      const metadata = await sharp(buffer).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      if (
        width < MIN_DIMENSION || height < MIN_DIMENSION ||
        width > MAX_DIMENSION || height > MAX_DIMENSION
      ) {
        return {
          valid: false,
          error: `Image dimensions must be between ${MIN_DIMENSION}x${MIN_DIMENSION} and ${MAX_DIMENSION}x${MAX_DIMENSION}`,
        };
      }
      return { valid: true, dimensions: { width, height } };
    } catch {
      return { valid: false, error: 'Unable to read image dimensions' };
    }
  }
}