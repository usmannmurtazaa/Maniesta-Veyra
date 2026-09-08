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
 * The design position is the center of the design.
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

  return {
    x: Math.min(Math.max(designPos.x, minX), maxX),
    y: Math.min(Math.max(designPos.y, minY), maxY),
  };
}

/**
 * Clamp the scale of a design so that it fits within a printable area.
 * Returns a scale value that is between minScale (0.05) and the maximum
 * scale that fits within the area.
 */
export function clampScale(
  scale: number,
  designSize: DesignSize,
  area: PrintableArea
): number {
  const minScale = 0.05;
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