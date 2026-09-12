import { useEffect, useRef } from 'react';
import {
  ASSETS, LEDE, LENS_ORDER, NAMES, SKY_GRADIENT,
  type Lens,
} from './heroAssets';
import { startProcedural } from './procedural';
import { useHeroMotion } from './useHeroMotion';
import { useLensSwitcher } from './useLensSwitcher';
import { useRiskStream } from './useRiskStream';
import HeroLens from './HeroLens';

const LEVEL_VAR: Record<string, string> = {
  LOW: 'var(--lvl-low)',
  WATCH: 'var(--lvl-watch)',
  WARNING: 'var(--lvl-warning)',
  CRITICAL: 'var(--lvl-critical)',
};

export default function Hero() {
  const { featured, left, right, titleFs, show } = useLensSwitcher();
  const { risk, level, offline } = useRiskStream();
  const skyRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<Record<Lens, HTMLCanvasElement | null>>({
    terrain: null, storm: null, impact: null,
  });
  const stopsRef = useRef<Record<Lens, (() => void) | null>>({ terrain: null, storm: null, impact: null });

  useHeroMotion();

  // Start / stop procedural canvas loops per lens. They run for all three
  // lenses but only the active one is visible.
  useEffect(() => {
    const stops = stopsRef.current;
    LENS_ORDER.forEach((l) => {
      const c = canvasRefs.current[l];
      if (c && !stops[l]) stops[l] = startProcedural(c, l);
    });
    return () => {
      LENS_ORDER.forEach((l) => { stops[l]?.(); stops[l] = null!; });
    };
  }, []);

  // Sky background-image → current lens still (or gradient fallback).
  useEffect(() => {
    if (!skyRef.current) return;
    const still = ASSETS[featured].still;
    skyRef.current.style.backgroundImage = still ? `url(${still})` : SKY_GRADIENT[featured];
    skyRef.current.style.backgroundSize = 'cover';
    skyRef.current.style.backgroundPosition = 'center';
  }, [featured]);

  // --level-color on .stage so the rule + ticker dot track the current level.
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>('.stage');
    if (stage) stage.style.setProperty('--level-color', LEVEL_VAR[level] ?? 'var(--lvl-watch)');
  }, [level]);

  return (
    <div className="stage">
      <div className="sky" ref={skyRef} aria-hidden="true">
        {LENS_ORDER.map((l) => {
          const clip = ASSETS[l].clip;
          const isActive = l === featured;
          if (clip) {
            return (
              <video
                key={l}
                data-lens={l}
                className={isActive ? 'is-active' : ''}
                autoPlay={isActive}
                muted
                loop
                playsInline
                preload={isActive ? 'auto' : 'none'}
                poster={ASSETS[l].still}
                aria-hidden="true"
              >
                <source src={clip} type="video/mp4" />
              </video>
            );
          }
          return (
            <canvas
              key={l}
              data-lens={l}
              ref={(el) => { canvasRefs.current[l] = el; }}
              className={isActive ? 'is-active' : ''}
              aria-hidden="true"
            />
          );
        })}
      </div>

      <div className="ui">
        <header className="navbar">
          <div className="navrow" data-open="false">
            <a className="logo" href="/">landslide<i>guard</i></a>
            <nav className="links" id="site-nav">
              <a href="/" aria-current="page">Overview</a>
              <a href="/about">About</a>
              <a href="/dashboard/map">Risk Map</a>
              <a href="/dashboard/routes">Routes</a>
              <a href="/dashboard/alerts">Alerts</a>
              <a className="enroll" href="/dashboard">Launch Console</a>
            </nav>
            <button
              className="burger" type="button" aria-label="Open navigation"
              aria-expanded="false" aria-controls="site-nav"
            >
              <span /><span /><span />
            </button>
          </div>
        </header>

        <div className="copy">
          <div className="col eyebrow">
            <span className="ent-mask"><span className="ent-line">LIVE LAYER</span></span>
          </div>
          <h1 className="col title" style={{ ['--title-fs' as any]: titleFs }}>
            <span className="ent-mask">
              <span className="ent-line">{NAMES[featured]}</span>
            </span>
          </h1>
          <div className="col rule"><span /></div>
          <p
            className="col lede"
            dangerouslySetInnerHTML={{ __html: LEDE[featured] }}
          />

          <div className="col cta">
            <HeroLens slot="l" lens={left}  onSelect={show} />
            <HeroLens slot="r" lens={right} onSelect={show} />
            <a href="/dashboard">OPEN CONSOLE</a>
            <span className="label label-l">{NAMES[left]}</span>
            <span className="label label-r">{NAMES[right]}</span>
          </div>

          <div
            className={`col ticker${offline ? ' is-offline' : ''}`}
            role="status"
            aria-live="polite"
          >
            <span className="dot" />
            <span className="ticker-text">RISK {risk}% · {level}</span>
          </div>
        </div>
      </div>

      <button className="scroll" type="button" aria-label="Open project information" onClick={() => { window.location.href = '/about'; }}>
        <svg viewBox="0 0 26 33" fill="none" aria-hidden="true">
          <path
            d="M13 1.5 V31.5 M1.9 20.4 L13 31.5 L24.1 20.4"
            stroke="#ffffff" strokeWidth="3"
            strokeLinecap="square" strokeLinejoin="miter"
          />
        </svg>
      </button>
    </div>
  );
}
