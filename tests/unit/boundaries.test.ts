import { describe, it, expect } from 'vitest';
import { enforceBoundary, clampScale, clampRotation } from '@/lib/customizer/boundaries';

describe('Boundary constraints', () => {
  it('clamps design within printable area', () => {
    const pos = { x: 10, y: 10 };
    const designSize = { width: 100, height: 100 };
    const area = { x: 0, y: 0, width: 200, height: 200 };
    const result = enforceBoundary(pos, designSize, area);
    expect(result.x).toBe(50); // half of width
    expect(result.y).toBe(50);
  });

  it('prevents design from moving outside', () => {
    const pos = { x: 250, y: 250 };
    const designSize = { width: 100, height: 100 };
    const area = { x: 0, y: 0, width: 200, height: 200 };
    const result = enforceBoundary(pos, designSize, area);
    expect(result.x).toBe(150); // 200 - 50
    expect(result.y).toBe(150);
  });

  it('clamps scale to fit area', () => {
    const designSize = { width: 100, height: 100 };
    const area = { x: 0, y: 0, width: 200, height: 100 };
    const scale = clampScale(3, designSize, area);
    expect(scale).toBeCloseTo(1.0); // limited by height
  });

  it('normalizes rotation', () => {
    expect(clampRotation(370)).toBe(10);
    expect(clampRotation(-10)).toBe(350);
  });
});