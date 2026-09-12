import { useCallback, useMemo, useState } from 'react';
import { LENS_ORDER, type Lens } from './heroAssets';

const TITLE_FS: Array<[number, number]> = [
  [5, 112.4], [6, 100], [7, 88], [8, 78], [10, 68], [12, 58],
];

function titleFs(len: number): number {
  for (const [max, fs] of TITLE_FS) if (len <= max) return fs;
  return 50;
}

export function useLensSwitcher() {
  const [featured, setFeatured] = useState<Lens>('terrain');

  const rest = useMemo(
    () => LENS_ORDER.filter((l) => l !== featured) as [Lens, Lens],
    [featured]
  );

  const show = useCallback((next: Lens) => {
    if (!LENS_ORDER.includes(next)) return;
    setFeatured((cur) => (cur === next ? cur : next));
  }, []);

  return {
    featured,
    left: rest[0],
    right: rest[1],
    titleFs: titleFs(featured.length),
    show,
  };
}
