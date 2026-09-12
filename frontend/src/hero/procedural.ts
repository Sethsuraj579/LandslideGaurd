import type { Lens } from './heroAssets';

/** Per-lens 30fps canvas loop; pauses when document.hidden. */
export function startProcedural(canvas: HTMLCanvasElement, lens: Lens): () => void {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  let raf = 0;
  let last = 0;
  const FRAME = 1000 / 30;
  let t = 0;

  const onVis = () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!raf) { last = 0; raf = requestAnimationFrame(loop); }
  };
  document.addEventListener('visibilitychange', onVis);

  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    if (now - last < FRAME) return;
    last = now;
    t += 0.016;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    if (lens === 'terrain') {
      // drifting fog
      for (let i = 0; i < 4; i++) {
        const y = h * (0.35 + i * 0.13);
        const off = ((t * (8 + i * 4)) % (w + 200)) - 100;
        const g = ctx.createLinearGradient(0, y - 40, 0, y + 40);
        g.addColorStop(0, 'rgba(121,220,232,0)');
        g.addColorStop(0.5, `rgba(121,220,232,${0.06 + i * 0.015})`);
        g.addColorStop(1, 'rgba(121,220,232,0)');
        ctx.fillStyle = g;
        ctx.fillRect(off - 100, y - 40, w + 200, 80);
      }
      // parallax contours
      ctx.strokeStyle = 'rgba(121,220,232,.14)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const y = h * (0.55 + i * 0.03) + Math.sin(t * 0.6 + i) * 3;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 12) {
          const yy = y + Math.sin((x * 0.008) + t * 0.4 + i * 0.7) * (6 + i * 0.4);
          if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
    }

    if (lens === 'storm') {
      ctx.strokeStyle = 'rgba(121,220,232,.32)';
      ctx.lineWidth = 1.2;
      const count = Math.floor(w / 22);
      for (let i = 0; i < count; i++) {
        const seed = i * 137.5;
        const x = ((seed + t * 260) % (w + 120)) - 60;
        const y = ((seed * 1.7 + t * 620) % (h + 160)) - 80;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 14, y + 34);
        ctx.stroke();
      }
      // sheet lightning pulse every ~6s
      const phase = (t % 6) / 6;
      if (phase > 0.02 && phase < 0.07) {
        const a = 1 - Math.abs(phase - 0.045) / 0.025;
        ctx.fillStyle = `rgba(200,235,255,${a * 0.35})`;
        ctx.fillRect(0, 0, w, h * 0.5);
      }
    }

    if (lens === 'impact') {
      // pulsing route polyline
      const pulse = 0.5 + Math.sin(t * 1.6) * 0.5;
      ctx.strokeStyle = `rgba(255,209,102,${0.35 + pulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.8);
      ctx.bezierCurveTo(w * 0.35, h * 0.55, w * 0.55, h * 0.85, w, h * 0.35);
      ctx.stroke();
      // settlement dots
      const pts = [
        [w * 0.18, h * 0.72], [w * 0.36, h * 0.66],
        [w * 0.58, h * 0.62], [w * 0.78, h * 0.5],
      ];
      for (let i = 0; i < pts.length; i++) {
        const [x, y] = pts[i];
        const r = 3 + Math.sin(t * 2 + i) * 1.2;
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(121,220,232,.5)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x, y, r + 6 + pulse * 4, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }

  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVis);
  };
}
