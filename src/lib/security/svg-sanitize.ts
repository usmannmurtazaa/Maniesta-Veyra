import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize an SVG string to remove scripts, event handlers, and dangerous elements.
 * Returns the sanitized SVG string or an empty string if invalid.
 */
export function sanitizeSvg(svgString: string): string {
  return DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'foreignObject', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onload', 'onclick', 'onerror', 'href', 'xlink:href'],
  });
}

/**
 * Validate that the sanitized SVG still contains an <svg> element.
 */
export function isValidSvg(sanitized: string): boolean {
  return sanitized.includes('<svg');
}