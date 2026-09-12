export interface PrintableArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesignSize {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

/**
 * Enforce that a design's center stays within a printable area.
 *
 * The design position is treated as the center of the design.
 * If the design is larger than the area (should not happen after
 * `clampScale`, but possible in edge cases), it is centered in the area
 * rather than pushed to the edge.
 */
export function enforceBoundary(
  designPos: Position,
  designSize: DesignSize,
  area: PrintableArea
): Position {
  const halfW = designSize.width / 2;
  const halfH = designSize.height / 2;

  const minX = area.x + halfW;
  const maxX = area.x + area.width - halfW;
  const minY = area.y + halfH;
  const maxY = area.y + area.height - halfH;

  const x =
    minX > maxX
      ? area.x + area.width / 2
      : Math.min(Math.max(designPos.x, minX), maxX);

  const y =
    minY > maxY
      ? area.y + area.height / 2
      : Math.min(Math.max(designPos.y, minY), maxY);

  return { x, y };
}

/**
 * Clamp the scale of a design so that it fits within a printable area.
 *
 * Returns `scale` bounded by:
 *   - lower bound: minScale (0.05) — but only if that fits
 *   - upper bound: the largest scale that keeps the design inside the area
 *
 * When the design is naturally larger than the area, minScale is overridden
 * because the design MUST fit. In that case the returned value is < 0.05.
 */
export function clampScale(
  scale: number,
  designSize: DesignSize,
  area: PrintableArea
): number {
  const minScale = 0.05;

  // Guard: with zero/negative dimensions, no meaningful constraint exists.
  if (
    designSize.width <= 0 ||
    designSize.height <= 0 ||
    area.width <= 0 ||
    area.height <= 0
  ) {
    return minScale;
  }

  const maxScaleByWidth = area.width / designSize.width;
  const maxScaleByHeight = area.height / designSize.height;
  const maxScale = Math.min(maxScaleByWidth, maxScaleByHeight);

  return Math.min(Math.max(scale, minScale), maxScale);
}

/**
 * Normalize a rotation angle to the range [0, 360).
 */
export function clampRotation(rotation: number): number {
  return ((rotation % 360) + 360) % 360;
}