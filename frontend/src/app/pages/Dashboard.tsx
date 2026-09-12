import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Activity, Bell, ChevronRight, CloudRain, Gauge, Map, Menu, Route, ShieldAlert, SlidersHorizontal, Waves, X } from "lucide-react";
import { apiGet } from "../../lib/api";
import "../../styles/dashboard.css";
import "../../styles/section-workspaces.css";

type Level = "LOW" | "WATCH" | "WARNING" | "CRITICAL";
type Summary = { data_mode: string; units_monitored: number; average_risk: number; by_level: Record<Level, number>; latest?: Array<{ level: Level }> };
type Snapshot = { id: number; unit: number; timestamp: string; fused_risk: number; level: Level; velocity: number; drivers: Record<string, number> };
type History = { results: Snapshot[] };
type AlertItem = { id: number; level: Level; status: string; message: string; recommended_action: string };
type Alerts = { results: AlertItem[] };

const demoSummary: Summary = { data_mode: "demo", units_monitored: 12, average_risk: 64.8, by_level: { LOW: 2, WATCH: 4, WARNING: 4, CRITICAL: 2 } };
const demoHistory: History = { results: [35, 43, 51, 64, 76].map((risk, index) => ({ id: index, unit: 1, timestamp: `2026-09-12T${10 + index}:00:00Z`, fused_risk: risk, level: risk >= 70 ? "CRITICAL" : risk >= 50 ? "WARNING" : "WATCH", velocity: 8 + index, drivers: { rainfall: 80 + index, moisture: 72 + index } })) };
const demoAlerts: Alerts = { results: [{ id: 1, level: "CRITICAL", status: "new", message: "Rapidly increasing risk in Demo Hills District", recommended_action: "Inspect vulnerable road corridors and notify local response teams." }, { id: 2, level: "WARNING", status: "new", message: "Rainfall threshold exceeded across 4 slope units", recommended_action: "Review safe route recommendations before dispatch." }] };
const sections: Record<string, string> = { console: "Command console", map: "Risk map", analytics: "Risk analytics", routes: "Route safety", impact: "Impact analysis", alerts: "Alerts", simulate: "Simulation" };
const layers = ["Dynamic risk", "Susceptibility", "Rainfall", "Soil moisture", "Infrastructure"];

function SectionWorkspace({ section, data, points, alerts, rainfall, setRainfall, simulated, runSimulation }: { section: string; data: Summary; points: Snapshot[]; alerts: AlertItem[]; rainfall: number; setRainfall: (value: number) => void; simulated: number | null; runSimulation: () => void }) {
  const cards: Record<string, { eyebrow: string; title: string; body: string; value: string; action: string }[]> = {
    analytics: [
      { eyebrow: "RISK DISTRIBUTION", title: "District signal", body: "Critical and warning units are concentrated along the eastern corridor.", value: `${data.by_level.CRITICAL + data.by_level.WARNING}`, action: "HIGH-RISK UNITS" },
      { eyebrow: "TREND", title: "Velocity window", body: "The latest stored snapshots show the direction and pace of change.", value: `+${(points.at(-1)?.velocity ?? 0).toFixed(1)}`, action: "POINTS / HOUR" },
      { eyebrow: "MODEL", title: "Fusion output", body: "Static susceptibility and dynamic triggers are combined before a warning is issued.", value: `${data.average_risk.toFixed(1)}%`, action: "AVERAGE RISK" },
    ],
    routes: [
      { eyebrow: "PRIMARY CORRIDOR", title: "Shillong → Hospital", body: "Risk-aware routing penalizes road segments crossing high-risk zones.", value: "WARNING", action: "REVIEW ROUTE" },
      { eyebrow: "ALTERNATIVE", title: "Eastern bypass", body: "A safer alternative can be evaluated against distance and exposure.", value: "LOWER RISK", action: "COMPARE PATHS" },
      { eyebrow: "NETWORK", title: "Road readiness", body: "Use the routing API to connect real road segments and blockage status.", value: "READY", action: "NETWORK STATUS" },
    ],
    impact: [
      { eyebrow: "POPULATION", title: "People at risk", body: "Exposure prioritizes locations where hazard and consequence overlap.", value: "4,000+", action: "ESTIMATED EXPOSURE" },
      { eyebrow: "INFRASTRUCTURE", title: "Critical assets", body: "Roads, bridges, hospitals, schools, and villages are tracked as assets.", value: "18", action: "ASSETS MONITORED" },
      { eyebrow: "RESPONSE", title: "Priority zone", body: "Dispatch attention to high-risk areas with the greatest potential impact.", value: "EAST 04", action: "RECOMMENDED ZONE" },
    ],
    alerts: alerts.map(alert => ({ eyebrow: alert.level, title: alert.message, body: alert.recommended_action, value: alert.status.toUpperCase(), action: "ALERT STATUS" })),
  };
  if (section === "simulate") return <section className="section-workspace simulation-workspace"><div className="workspace-copy"><p className="section-label">SCENARIO LAB</p><h2>Change the conditions. See the consequence.</h2><p>Test a rainfall surge against the current fused risk without modifying stored observations.</p></div><div className="scenario-control"><div><span>RAINFALL CHANGE</span><strong>+{rainfall}%</strong></div><input aria-label="Scenario rainfall change" type="range" min="0" max="100" value={rainfall} onChange={event => setRainfall(Number(event.target.value))} /><button className="simulate-button" onClick={runSimulation}>RUN SCENARIO <ChevronRight size={16} /></button>{simulated !== null && <p className="sim-result">Projected risk: <b>{simulated}%</b></p>}</div></section>;
  const content = cards[section] ?? cards.analytics;
  return <section className={`section-workspace ${section}-workspace`}><div className="workspace-copy"><p className="section-label">{section === "alerts" ? "EARLY WARNING ENGINE" : "DECISION SUPPORT"}</p><h2>{sections[section]}</h2><p>{section === "analytics" ? "Read the signals behind changing risk across monitored slope units." : section === "routes" ? "Find a path that balances distance, risk, and connectivity." : "Move from hazard probability to a clear response priority."}</p></div><div className="workspace-cards">{content.map((card, index) => <article className="workspace-card" key={`${card.title}-${index}`}><p className="section-label">{card.eyebrow}</p><h3>{card.title}</h3><strong>{card.value}</strong><small>{card.action}</small><p>{card.body}</p></article>)}</div></section>;
}

export function Dashboard() {
  const { section = "console" } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [layer, setLayer] = useState("Dynamic risk");
  const [rainfall, setRainfall] = useState(30);
  const [simulated, setSimulated] = useState<number | null>(null);
  const summary = useQuery({ queryKey: ["risk-summary"], queryFn: () => apiGet<Summary>("/api/v1/risk/summary/"), retry: false, refetchInterval: 10_000 });
  const history = useQuery({ queryKey: ["risk-history"], queryFn: () => apiGet<History>("/api/v1/risk/history/?unit_id=1"), retry: false, refetchInterval: 10_000 });
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: () => apiGet<Alerts>("/api/v1/alerts/"), retry: false, refetchInterval: 10_000 });
  const data = summary.data ?? demoSummary;
  const points = history.data?.results.length ? history.data.results : demoHistory.results;
  const alertData = alerts.data?.results.length ? alerts.data.results : demoAlerts.results;
  const currentRisk = simulated ?? data.average_risk;
  const trend = points.at(-1)?.velocity ?? 8;
  const mapLevels = data.latest?.map(snapshot => snapshot.level) ?? ["CRITICAL", "WARNING", "WARNING", "WATCH", "LOW", "WATCH"];

  function runSimulation() {
    setSimulated(Math.min(100, Math.round(currentRisk + rainfall * 0.18)));
  }

  return <div className="console-shell">
    <header className="console-topbar">
      <Link className="console-brand" to="/"><span>LANDSLIDE</span><b>GUARD</b><small>AI / NER EARLY WARNING</small></Link>
      <div className="top-status"><span className="live-dot" /> LIVE MONITORING <em>{data.data_mode === "demo" ? "SYNTHETIC FEED" : "API CONNECTED"}</em></div>
      <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
    </header>
    <aside className={`console-nav ${mobileOpen ? "is-open" : ""}`}>
      <div className="nav-kicker">COMMAND CENTER</div>
      <nav>{Object.entries(sections).map(([key, label]) => <Link onClick={() => setMobileOpen(false)} className={section === key ? "active" : ""} key={key} to={`/dashboard/${key}`}><span>{key === "map" ? <Map size={17} /> : key === "analytics" ? <Activity size={17} /> : key === "routes" ? <Route size={17} /> : key === "impact" ? <ShieldAlert size={17} /> : key === "alerts" ? <Bell size={17} /> : <SlidersHorizontal size={17} />}</span>{label}<ChevronRight size={14} /></Link>)}</nav>
      <div className="nav-footer"><span className="pulse-ring" /><div><b>System ready</b><small>Last sync 14:32 IST</small></div></div>
    </aside>
    <main className="console-main">
      <div className="console-heading"><div><p className="section-label">NORTH EASTERN REGION / OPERATIONAL VIEW</p><h1>{sections[section] ?? "Risk map"}</h1><p className="heading-copy">Risk evolves with the environment. Watch the conditions that change the outcome.</p></div><div className="heading-date"><span>{summary.isError ? "OFFLINE DEMO MODE" : "LIVE API FEED"}</span><b>{summary.isFetching ? "SYNCING..." : "SYNCED JUST NOW"}</b></div></div>
      <section className="metric-grid">
        <article className="metric-card metric-primary"><div className="metric-label"><Gauge size={16} /> FUSED RISK</div><strong>{currentRisk.toFixed(1)}<sup>%</sup></strong><span className="metric-trend up">+{trend.toFixed(1)}% / hr</span><div className="meter"><i style={{ width: `${currentRisk}%` }} /></div><small>Adaptive fusion · {currentRisk >= 70 ? "CRITICAL" : currentRisk >= 50 ? "WARNING" : "WATCH"}</small></article>
        <article className="metric-card"><div className="metric-label"><Activity size={16} /> MONITORED UNITS</div><strong>{data.units_monitored}</strong><span className="metric-sub">ACTIVE SLOPE UNITS</span><div className="mini-bars">{[32, 42, 37, 55, 48, 72, 67, 81, 76, 88].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div></article>
        <article className="metric-card"><div className="metric-label"><Bell size={16} /> ACTIVE WARNINGS</div><strong>{(data.by_level.WARNING ?? 0) + (data.by_level.CRITICAL ?? 0)}</strong><span className="metric-sub">{data.by_level.CRITICAL ?? 0} CRITICAL · {data.by_level.WARNING ?? 0} WARNING</span><div className="warning-strip"><b style={{ width: `${(data.by_level.CRITICAL / data.units_monitored) * 100}%` }} /><i style={{ width: `${(data.by_level.WARNING / data.units_monitored) * 100}%` }} /></div></article>
        <article className="metric-card"><div className="metric-label"><Waves size={16} /> RISK VELOCITY</div><strong>+{trend.toFixed(1)}</strong><span className="metric-sub">POINTS / HOUR</span><p className="velocity-copy">Risk is <b>rapidly increasing</b> across the eastern corridor.</p></article>
      </section>
      {section === "console" && <section className="console-snapshot"><article><div className="metric-label"><Route size={16} /> ROUTE SAFETY</div><h2>Primary corridor under review</h2><p>Risk-aware routing is ready to compare the shortest path with a safer alternative.</p><Link to="/dashboard/routes" className="text-action">OPEN ROUTE ANALYSIS <ChevronRight size={15} /></Link></article><article><div className="metric-label"><ShieldAlert size={16} /> IMPACT PRIORITY</div><h2>Eastern corridor · Priority 01</h2><p>Combine hazard probability with population and infrastructure exposure before dispatch.</p><Link to="/dashboard/impact" className="text-action">OPEN IMPACT ANALYSIS <ChevronRight size={15} /></Link></article></section>}
      {section === "console" || section === "map" ? <div className="dashboard-grid">
        <section className="panel map-panel"><div className="panel-head"><div><p className="section-label">SPATIAL INTELLIGENCE</p><h2>Live hazard field</h2></div><div className="layer-switcher">{layers.map(item => <button className={layer === item ? "selected" : ""} onClick={() => setLayer(item)} key={item}>{item}</button>)}</div></div><div className="risk-map"><div className="map-grid" /><div className="map-river" /><div className="map-label label-one">SHILLONG<span>LIVE RISK FIELD</span></div><div className="map-label label-two">EASTERN CORRIDOR<span>RISING VELOCITY</span></div>{[[24,55],[42,31],[63,62],[76,37],[83,74],[51,78]].map(([left, top], i) => { const level = mapLevels[i] ?? "WATCH"; return <button aria-label={`${level} risk unit ${i + 1}`} className={`map-node ${String(level).toLowerCase()}`} style={{ left: `${left}%`, top: `${top}%` }} key={i}><span>{i + 1}</span></button>; })}<div className="map-legend"><b>{layer}</b><span><i className="critical" /> Critical</span><span><i className="warning" /> Warning</span><span><i className="watch" /> Watch</span><span><i className="low" /> Low</span></div></div></section>
        <section className="panel trend-panel"><div className="panel-head"><div><p className="section-label">TEMPORAL SIGNAL</p><h2>Risk velocity</h2></div><span className="panel-badge">LIVE / 5 HRS</span></div><div className="chart"><div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-area"><div className="chart-lines" /><svg viewBox="0 0 500 190" preserveAspectRatio="none" aria-label="Risk trend chart"><polyline points={points.map((point, index) => `${index * (500 / Math.max(points.length - 1, 1))},${190 - point.fused_risk * 1.7}`).join(" ")} fill="none" stroke="var(--orange)" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg><div className="chart-x"><span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span></div></div></div><div className="trend-callout"><span className="callout-line" /><div><b>Rapid increase detected</b><small>+{trend.toFixed(1)} risk points per hour</small></div></div></section>
        <section className="panel conditions-panel"><div className="panel-head"><div><p className="section-label">ENVIRONMENTAL TRIGGERS</p><h2>Conditions now</h2></div><CloudRain className="panel-icon" /></div><div className="condition"><span className="condition-icon rain"><CloudRain size={18} /></span><div><b>Rainfall · 24h</b><small>Current accumulation</small></div><strong>86 <i>mm</i></strong></div><div className="condition"><span className="condition-icon water"><Waves size={18} /></span><div><b>Soil moisture</b><small>Saturation index</small></div><strong>78 <i>%</i></strong></div><div className="condition"><span className="condition-icon forecast"><Activity size={18} /></span><div><b>Forecast risk</b><small>Next 6 hours</small></div><strong>85 <i>%</i></strong></div><div className="forecast-bar"><span>FORECAST WINDOW</span><b>Peak intensity expected in 03:40 hrs</b></div></section>
        <section className="panel explain-panel"><div className="panel-head"><div><p className="section-label">MODEL EXPLAINABILITY</p><h2>Why this area is risky</h2></div><span className="panel-badge">UNIT 004</span></div><p className="explain-intro">The fusion engine is weighing these factors most heavily right now.</p>{[["Rainfall intensity",87,"orange"],["Slope susceptibility",82,"red"],["Soil moisture",79,"blue"],["Antecedent rainfall",72,"amber"]].map(([name, value, color]) => <div className="explain-row" key={String(name)}><div><span>{name}</span><b>{value}%</b></div><div className="explain-bar"><i className={String(color)} style={{ width: `${value}%` }} /></div></div>)}<button className="text-action">OPEN FULL EXPLANATION <ChevronRight size={15} /></button></section>
        <section className="panel alert-panel"><div className="panel-head"><div><p className="section-label">EARLY WARNING ENGINE</p><h2>Active alerts</h2></div><Link to="/dashboard/alerts" className="text-action">VIEW ALL <ChevronRight size={15} /></Link></div>{alertData.map(alert => <div className="alert-row" key={alert.id}><span className={`alert-mark ${alert.level.toLowerCase()}`} /><div><b>{alert.message}</b><small>{alert.recommended_action}</small></div><span className={`level-tag ${alert.level.toLowerCase()}`}>{alert.level}</span></div>)}</section>
        <section className="panel simulation-panel"><div className="panel-head"><div><p className="section-label">WHAT-IF SIMULATION</p><h2>Test a rainfall surge</h2></div><SlidersHorizontal className="panel-icon" /></div><div className="sim-value"><strong>+{rainfall}%</strong><span>rainfall change</span></div><input aria-label="Rainfall increase" type="range" min="0" max="100" value={rainfall} onChange={event => { setRainfall(Number(event.target.value)); setSimulated(null); }} /><div className="range-labels"><span>0%</span><span>100%</span></div><button className="simulate-button" onClick={runSimulation}>RUN SCENARIO <ChevronRight size={16} /></button>{simulated !== null && <p className="sim-result">Projected fused risk: <b>{simulated}%</b></p>}</section>
      </div> : <SectionWorkspace section={section} data={data} points={points} alerts={alertData} rainfall={rainfall} setRainfall={setRainfall} simulated={simulated} runSimulation={runSimulation} />}
    </main>
  </div>;
}
