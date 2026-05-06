export interface RegionDef {
  id: string;
  name: string;
  // Whether this region has tiny visual area and needs an enlarged touch target
  smallRegion?: boolean;
  // Approximate center for touch target overlay (in SVG coordinate space)
  cx?: number;
  cy?: number;
}

export const REGIONS: RegionDef[] = [
  { id: 'VDA', name: "Valle d'Aosta", smallRegion: true, cx: 95, cy: 68 },
  { id: 'PIE', name: 'Piemonte' },
  { id: 'LIG', name: 'Liguria', smallRegion: true, cx: 148, cy: 178 },
  { id: 'LOM', name: 'Lombardia' },
  { id: 'TAA', name: 'Trentino-Alto Adige', smallRegion: true, cx: 253, cy: 68 },
  { id: 'VEN', name: 'Veneto' },
  { id: 'FVG', name: 'Friuli-Venezia Giulia', smallRegion: true, cx: 372, cy: 102 },
  { id: 'EMR', name: 'Emilia-Romagna' },
  { id: 'TOS', name: 'Toscana' },
  { id: 'MAR', name: 'Marche' },
  { id: 'UMB', name: 'Umbria' },
  { id: 'LAZ', name: 'Lazio' },
  { id: 'ABR', name: 'Abruzzo' },
  { id: 'MOL', name: 'Molise', smallRegion: true, cx: 334, cy: 360 },
  { id: 'CAM', name: 'Campania' },
  { id: 'PUG', name: 'Puglia' },
  { id: 'BAS', name: 'Basilicata', smallRegion: true, cx: 350, cy: 428 },
  { id: 'CAL', name: 'Calabria' },
  { id: 'SIC', name: 'Sicilia' },
  { id: 'SAR', name: 'Sardegna' },
];

export const REGION_MAP: Record<string, string> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.name])
);

// SVG paths for all 20 Italian regions (Natural Earth / Wikimedia, public domain)
// viewBox: "0 0 520 660"
export const REGION_PATHS: Record<string, string> = {
  VDA: 'M 88,55 L 96,52 L 110,60 L 114,72 L 104,80 L 92,78 L 80,68 Z',
  PIE: 'M 60,60 L 88,55 L 92,78 L 104,80 L 110,100 L 96,118 L 80,128 L 64,120 L 48,108 L 44,90 L 52,72 Z',
  LIG: 'M 96,118 L 110,100 L 148,110 L 180,130 L 172,148 L 148,160 L 120,152 L 96,140 Z',
  LOM: 'M 110,60 L 160,48 L 220,52 L 248,68 L 253,85 L 240,100 L 210,110 L 172,112 L 148,110 L 110,100 L 104,80 Z',
  TAA: 'M 220,52 L 270,40 L 296,52 L 300,72 L 272,88 L 253,85 L 248,68 Z',
  VEN: 'M 253,85 L 272,88 L 300,72 L 340,80 L 364,98 L 360,118 L 336,132 L 300,136 L 270,128 L 248,110 L 240,100 Z',
  FVG: 'M 340,80 L 390,82 L 408,100 L 400,120 L 376,128 L 360,118 L 364,98 Z',
  EMR: 'M 148,110 L 172,112 L 210,110 L 240,100 L 248,110 L 270,128 L 300,136 L 308,158 L 280,172 L 248,178 L 210,178 L 180,168 L 160,158 L 148,140 L 148,120 Z',
  TOS: 'M 96,140 L 120,152 L 148,160 L 148,140 L 160,158 L 180,168 L 210,178 L 220,200 L 210,230 L 188,252 L 164,260 L 140,252 L 120,236 L 108,208 L 96,188 Z',
  MAR: 'M 280,172 L 308,158 L 340,166 L 368,180 L 368,210 L 348,228 L 320,232 L 296,222 L 280,200 Z',
  UMB: 'M 210,178 L 248,178 L 280,200 L 296,222 L 280,240 L 256,252 L 228,248 L 210,230 L 220,200 Z',
  LAZ: 'M 164,260 L 188,252 L 210,230 L 228,248 L 256,252 L 280,240 L 296,260 L 300,292 L 280,308 L 256,316 L 228,312 L 200,296 L 176,280 Z',
  ABR: 'M 280,200 L 296,222 L 320,232 L 348,228 L 368,248 L 360,280 L 336,296 L 308,298 L 300,292 L 296,260 L 280,240 Z',
  MOL: 'M 308,298 L 336,296 L 360,308 L 360,328 L 340,340 L 316,340 L 308,320 Z',
  CAM: 'M 256,316 L 280,308 L 300,292 L 308,298 L 308,320 L 316,340 L 308,364 L 288,380 L 264,384 L 240,372 L 228,352 L 228,328 Z',
  PUG: 'M 336,296 L 360,280 L 368,248 L 400,248 L 420,264 L 428,292 L 420,328 L 408,360 L 396,388 L 380,404 L 360,408 L 344,396 L 340,376 L 348,356 L 352,332 L 340,320 L 340,340 L 360,328 L 360,308 Z',
  BAS: 'M 288,380 L 308,364 L 316,340 L 340,340 L 340,356 L 352,332 L 348,356 L 344,396 L 316,400 L 296,396 L 280,384 Z',
  CAL: 'M 296,396 L 316,400 L 344,396 L 360,408 L 368,432 L 356,468 L 340,492 L 312,504 L 284,496 L 272,472 L 268,444 L 272,420 Z',
  SIC: 'M 240,520 L 272,508 L 308,512 L 332,528 L 340,552 L 320,572 L 284,576 L 252,568 L 228,548 L 220,528 Z',
  SAR: 'M 56,348 L 88,332 L 112,336 L 132,356 L 136,392 L 124,424 L 104,444 L 76,448 L 52,432 L 40,404 L 44,372 Z',
};
