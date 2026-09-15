/**
 * Garment color palette for the custom print studio.
 *
 * 20 colors grouped by mood. Each has a name + hex code.
 * Add more by extending the arrays — the seed and UI handle any length.
 */
export const GARMENT_COLOR_PALETTE = {
  neutrals: [
    { name: 'Black',     hexCode: '#1A1A2E' },
    { name: 'Charcoal',  hexCode: '#36454F' },
    { name: 'Off White', hexCode: '#F5F5F0' },
    { name: 'White',     hexCode: '#FFFFFF' },
    { name: 'Ivory',     hexCode: '#FFFEF0' },
    { name: 'Cream',     hexCode: '#F5EFE0' },
    { name: 'Beige',     hexCode: '#E8DCC4' },
    { name: 'Sand',      hexCode: '#C2B280' },
  ],
  darks: [
    { name: 'Slate Grey',   hexCode: '#708090' },
    { name: 'Stone',        hexCode: '#A8A8A0' },
    { name: 'Ash',          hexCode: '#B2B5B8' },
    { name: 'Washed Black', hexCode: '#2C2C2C' },
  ],
  blues: [
    { name: 'Navy',       hexCode: '#1B2845' },
    { name: 'Indigo',     hexCode: '#3F4E6E' },
    { name: 'Dusty Blue', hexCode: '#7A96B0' },
    { name: 'Sky',        hexCode: '#A8C4D9' },
  ],
  earth: [
    { name: 'Olive',    hexCode: '#6B7A4A' },
    { name: 'Forest',   hexCode: '#2E4A3B' },
    { name: 'Rust',     hexCode: '#A65A3A' },
    { name: 'Burgundy', hexCode: '#6B1F2C' },
  ],
} as const;

/** Flat array in display order — used by the seed and by admin. */
export const GARMENT_COLORS = [
  ...GARMENT_COLOR_PALETTE.neutrals,
  ...GARMENT_COLOR_PALETTE.darks,
  ...GARMENT_COLOR_PALETTE.blues,
  ...GARMENT_COLOR_PALETTE.earth,
];