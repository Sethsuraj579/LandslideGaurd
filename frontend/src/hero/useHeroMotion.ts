import { useEffect } from 'react';

/** Runs the entrance sequence once, then removes `.anim` and `.play`. */
export function useHeroMotion() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('anim')) return;

    let raf1 = 0, raf2 = 0, timer = 0, cancelled = false;

    const fontsReady: Promise<unknown> =
      'fonts' in document
        ? Promise.race([
            document.fonts.ready,
            new Promise((r) => setTimeout(r, 500)),
          ])
        : Promise.resolve();

    fontsReady.then(() => {
      if (cancelled) return;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          if (cancelled) return;
          root.classList.add('play');
          timer = window.setTimeout(() => {
            root.classList.remove('anim', 'play');
          }, 2150);
        });
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
  }, []);
}
