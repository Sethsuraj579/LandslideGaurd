export type Lens = 'terrain' | 'storm' | 'impact';

export const LENS_ORDER: Lens[] = ['terrain', 'storm', 'impact'];

export const NAMES: Record<Lens, string> = {
  terrain: 'TERRAIN',
  storm: 'STORM',
  impact: 'IMPACT',
};

export const LEDE: Record<Lens, string> = {
  terrain:
    'Rugged Himalayan terrain, scored cell-by-cell for long-term landslide susceptibility. Course enrollment <br>is open — models retrain weekly on new inventory data.',
  storm:
    'Monsoon rainfall and soil-moisture telemetry fused in real time. Course enrollment <br>is open — thresholds recalibrate every season.',
  impact:
    'Roads, bridges, hospitals and villages ranked by who and what a failure would strand. Course enrollment <br>is open — exposure layers refresh nightly.',
};

export const ASSETS: Record<
  Lens,
  { clip?: string; still?: string; cutout?: string }
> = {
  terrain: { clip: undefined, still: undefined, cutout: undefined },
  storm:   { clip: undefined, still: undefined, cutout: undefined },
  impact:  { clip: undefined, still: undefined, cutout: undefined },
};

/** Per-lens CSS gradient backdrop (rendered when `still` is missing). */
export const SKY_GRADIENT: Record<Lens, string> = {
  terrain:
    'radial-gradient(120% 90% at 50% 105%, #0b3a4a 0%, #072435 42%, #04101f 100%)',
  storm:
    'radial-gradient(120% 90% at 50% 0%, #2c3f5c 0%, #1a2a44 45%, #071227 100%)',
  impact:
    'radial-gradient(120% 90% at 50% 110%, #5a3a1e 0%, #2a2136 50%, #04101f 100%)',
};

/** Draw-to-fill ~97% SVG cutouts so the sizing math holds exactly. */
export const CUTOUT_SVG: Record<Lens, string> = {
  terrain: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0d2a44"/><stop offset="1" stop-color="#061627"/></linearGradient></defs>
    <path d="M3 196 L58 74 L92 128 L128 46 L197 196 Z" fill="url(#tg)" stroke="#79dce8" stroke-width="1.2" stroke-linejoin="round"/>
    <g stroke="#79dce8" stroke-width=".7" opacity=".55">
      <line x1="58" y1="74" x2="86" y2="196"/>
      <line x1="70" y1="82" x2="100" y2="196"/>
      <line x1="82" y1="94" x2="114" y2="196"/>
      <line x1="128" y1="46" x2="150" y2="196"/>
      <line x1="140" y1="60" x2="164" y2="196"/>
    </g>
    <circle cx="128" cy="46" r="4.5" fill="#ffd166" stroke="#fff" stroke-width="1"/>
    <line x1="128" y1="46" x2="128" y2="28" stroke="#ffd166" stroke-width="1.4"/>
  </svg>`,

  storm: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2c3f5c"/><stop offset="1" stop-color="#0b1a30"/></linearGradient></defs>
    <ellipse cx="100" cy="66" rx="86" ry="42" fill="url(#sg)" stroke="#79dce8" stroke-width="1.2"/>
    <ellipse cx="60"  cy="86" rx="42" ry="30" fill="#1e3050" opacity=".9"/>
    <ellipse cx="142" cy="92" rx="48" ry="34" fill="#22344f" opacity=".9"/>
    <g stroke="#79dce8" stroke-width="1.2" opacity=".75">
      <line x1="58" y1="128" x2="50" y2="192"/>
      <line x1="78" y1="128" x2="70" y2="192"/>
      <line x1="98" y1="128" x2="90" y2="192"/>
      <line x1="118" y1="128" x2="110" y2="192"/>
      <line x1="138" y1="128" x2="130" y2="192"/>
      <line x1="158" y1="128" x2="150" y2="192"/>
    </g>
  </svg>`,

  impact: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 168 Q54 118 100 138 T197 96" stroke="#ffd166" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M3 168 Q54 118 100 138 T197 96" stroke="#fff" stroke-width="1.4" fill="none" stroke-dasharray="5 8" opacity=".7"/>
    <circle cx="46"  cy="146" r="4.5" fill="#fff"/>
    <circle cx="72"  cy="134" r="4"   fill="#fff"/>
    <circle cx="120" cy="126" r="4.5" fill="#fff"/>
    <circle cx="154" cy="108" r="4"   fill="#fff"/>
    <g transform="translate(96 74)">
      <rect x="-10" y="-4" width="20" height="8" fill="#ff4d4d"/>
      <rect x="-4" y="-10" width="8"  height="20" fill="#ff4d4d"/>
    </g>
    <path d="M56 158 h8 M60 154 v8" stroke="#79dce8" stroke-width="2.4"/>
  </svg>`,
};
