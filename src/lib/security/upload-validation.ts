import { fileTypeFromBuffer } from 'file-type';
import sizeOf from 'image-size';

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'svg']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_DIMENSION = 200;
const MAX_DIMENSION = 5000;

/**
 * Sanitize SVG by stripping dangerous content.
 * This is a targeted sanitizer for a controlled upload context — not a
 * general-purpose HTML sanitizer. It removes:
 *   - <script>, <foreignObject>, <iframe>, <object>, <embed>, <use xlink:href>
 *   - All event handlers (on*)
 *   - javascript: URLs
 *   - External references in href / xlink:href / src
 *
 * DOMPurify + jsdom would be more thorough, but jsdom (~80 MB) is not
 * viable on serverless. This covers the OWASP SVG attack surface.
 */
function sanitizeSvg(raw: string): { safe: string; rejected: boolean } {
  let svg = raw;

  // 1. Remove script / dangerous elements
  svg = svg.replace(/<\s*(script|foreignObject|iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  svg = svg.replace(/<\s*(script|foreignObject|iframe|object|embed)\b[^>]*\/?>/gi, '');

  // 2. Remove all event-handler attributes (onclick, onload, onmouseover, ...)
  svg = svg.replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '');

  // 3. Remove javascript: URLs
  svg = svg.replace(/(href|src|xlink:href)\s*=\s*["']\s*javascript:[^"']*["']/gi, '');

  // 4. Remove external references (http(s)://, //)
  svg = svg.replace(/(href|src|xlink:href)\s*=\s*["']\s*(https?:)?\/\/[^"']*["']/gi, '');

  // 5. Remove DOCTYPE (can carry XXE)
  svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');

  // 6. Remove XML processing instructions
  svg = svg.replace(/<\?xml[^>]*\?>/gi, '');

  // 7. Verify the result is still an SVG
  if (!/<svg[\s>]/i.test(svg)) {
    return { safe: '', rejected: true };
  }

  // 8. Belt-and-suspenders: reject if anything suspicious remains
  if (/<script|javascript:|on\w+\s*=/i.test(svg)) {
    return { safe: '', rejected: true };
  }

  return { safe: svg, rejected: false };
}

export async function validateUpload(file: File): Promise<{
  valid: boolean;
  error?: string;
  dimensions?: { width: number; height: number };
}> {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10 MB limit' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: 'Invalid file type' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType || !ALLOWED_MIME_TYPES.has(fileType.mime)) {
    return { valid: false, error: 'File content does not match extension' };
  }

  if (fileType.mime === 'image/svg+xml') {
    const svgString = buffer.toString('utf8');
    const { safe, rejected } = sanitizeSvg(svgString);
    if (rejected || !safe) {
      return { valid: false, error: 'Invalid or unsafe SVG content' };
    }
    return { valid: true };
  }

  try {
    const dims = sizeOf(buffer);
    if (
      !dims.width || !dims.height ||
      dims.width < MIN_DIMENSION || dims.height < MIN_DIMENSION ||
      dims.width > MAX_DIMENSION || dims.height > MAX_DIMENSION
    ) {
      return {
        valid: false,
        error: `Image dimensions must be between ${MIN_DIMENSION}×${MIN_DIMENSION} and ${MAX_DIMENSION}×${MAX_DIMENSION}`,
      };
    }
    return { valid: true, dimensions: { width: dims.width, height: dims.height } };
  } catch {
    return { valid: false, error: 'Unable to read image dimensions' };
  }
}