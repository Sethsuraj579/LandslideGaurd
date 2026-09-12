import { Link } from "react-router-dom";
import { ArrowUpRight, CloudRain, MapPinned, Route, ShieldCheck, Sparkles, Waves } from "lucide-react";
import "../../styles/about.css";

const pillars = [
  { icon: <MapPinned />, title: "Where?", text: "Map slope units and terrain susceptibility across the North Eastern Region." },
  { icon: <CloudRain />, title: "When?", text: "Track rainfall, soil moisture, forecast conditions, and risk velocity as they change." },
  { icon: <Sparkles />, title: "Why?", text: "Explain each warning with the environmental and terrain factors driving the score." },
  { icon: <Route />, title: "What is exposed?", text: "Connect hazards to roads, villages, hospitals, schools, and critical infrastructure." },
  { icon: <ShieldCheck />, title: "What next?", text: "Recommend safer routes and give response teams an actionable early warning." },
];

export function About() {
  return <main className="about-page">
    <header className="about-nav"><Link className="about-logo" to="/"><span>LANDSLIDE</span><b>GUARD</b></Link><nav><Link to="/">Overview</Link><Link className="active" to="/about">About the project</Link><Link to="/dashboard">Dashboard</Link><Link to="/dashboard/console">Launch console <ArrowUpRight size={15} /></Link></nav></header>
    <section className="about-hero"><div className="about-orbit orbit-one" /><div className="about-orbit orbit-two" /><p className="about-kicker">SMART INDIA HACKATHON · SIH26001</p><h1>AI-based early warning and landslide risk monitoring system in the NER.</h1><p className="about-lede">LandslideGuard AI turns fragmented terrain, weather, and infrastructure signals into a live decision-support system for communities and responders across the North Eastern Region.</p><Link className="about-cta" to="/dashboard/console">Explore the command center <ArrowUpRight size={17} /></Link></section>
    <section className="problem-band"><div><p className="about-kicker">THE PROBLEM</p><h2>Landslide risk evolves with the environment.</h2></div><p>Static susceptibility maps show where the ground is vulnerable, but they cannot tell responders when conditions are becoming dangerous. Rainfall-only warnings can miss the terrain and exposure context. NER needs an operational layer that brings these signals together and updates the picture continuously.</p></section>
    <section className="about-section"><div className="about-section-heading"><p className="about-kicker">ONE SYSTEM, FIVE ANSWERS</p><h2>From prediction to preparedness.</h2><p>The platform is designed around the questions that matter before a landslide occurs.</p></div><div className="pillar-grid">{pillars.map((pillar) => <article className="pillar" key={pillar.title}><span className="pillar-icon">{pillar.icon}</span><h3>{pillar.title}</h3><p>{pillar.text}</p></article>)}</div></section>
    <section className="method-section"><div><p className="about-kicker">HOW IT WORKS</p><h2>Adaptive risk intelligence.</h2><p>The engine combines long-term susceptibility from terrain, geology, soil, land cover, and historical events with dynamic rainfall, moisture, forecast, and exposure signals.</p></div><div className="method-flow"><span>STATIC SUSCEPTIBILITY</span><i>+</i><span>LIVE CONDITIONS</span><i>+</i><span>IMPACT & ROUTES</span><b>→ ACTIONABLE WARNING</b></div></section>
    <footer className="about-footer"><div><span className="about-logo">LANDSLIDE<b>GUARD</b></span><p>Built for safer decisions in the North Eastern Region.</p></div><Link to="/dashboard/console">Launch LandslideGuard console <ArrowUpRight size={16} /></Link></footer>
  </main>;
}