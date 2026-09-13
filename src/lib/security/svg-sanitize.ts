/**
 * Targeted SVG sanitizer for a controlled upload context.
 *
 * This is NOT a general-purpose HTML sanitizer. It removes the OWASP-flagged
 * SVG attack surface:
 *   - <script>, <foreignObject>, <iframe>, <object>, <embed>
 *   - All on* event handlers
 *   - javascript: URLs
 *   - External references (http/https/protocol-relative)
 *   - <style> blocks and url() in inline styles
 *   - SMIL animation elements (which can rewrite href at runtime)
 *   - DOCTYPE and XML processing instructions
 *
 * We do NOT use DOMPurify + jsdom because jsdom (~80 MB) causes serverless
 * cold-start crashes on Netlify/Vercel Lambda. For a private-bucket upload
 * served via signed URLs in an <img> tag, this regex approach is sufficient.
 */
export function sanitizeSvg(raw: string): string {
  let svg = raw;

  // 1. Remove <script>, <foreignObject>, <iframe>, <object>, <embed> — both
  //    paired and self-closing forms.
  svg = svg.replace(
    /<\s*(script|foreignObject|iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
    ''
  );
  svg = svg.replace(
    /<\s*(script|foreignObject|iframe|object|embed)\b[^>]*\/?>/gi,
    ''
  );

  // 2. Remove all on* event handler attributes.
  svg = svg.replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '');

  // 3. Remove javascript: URLs.
  svg = svg.replace(
    /(href|src|xlink:href)\s*=\s*["']\s*javascript:[^"']*["']/gi,
    ''
  );

  // 4. Remove external references (http/https/protocol-relative).
  svg = svg.replace(
    /(href|src|xlink:href)\s*=\s*["']\s*(https?:)?\/\/[^"']*["']/gi,
    ''
  );

  // 5. Remove <style> blocks and url() in inline styles.
  svg = svg.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  svg = svg.replace(/\sstyle\s*=\s*["'][^"']*url\s*\([^"']*["']/gi, '');

  // 6. Remove SMIL animation elements.
  svg = svg.replace(
    /<\s*(animate|set|animateTransform|animateMotion)\b[^>]*\/?>/gi,
    ''
  );

  // 7. Remove DOCTYPE and XML processing instructions.
  svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');
  svg = svg.replace(/<\?xml[^>]*\?>/gi, '');

  return svg;
}

/**
 * Validate that the sanitized SVG still contains an <svg> element.
 */
export function isValidSvg(sanitized: string): boolean {
  return /<svg[\s>]/i.test(sanitized);
}