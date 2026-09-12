import { ArrowUpRight, CloudRain, MapPinned, Route, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Hero from "../../hero/Hero";
import { useLanguage } from "../../lib/language";
import "../../styles/landing-about.css";

export function Landing() {
	const { t } = useLanguage();
	return <>
		<Hero />
		<section className="landing-about" id="about-preview">
			<div className="landing-about-intro">
				<p className="about-kicker">SIH26001 / NORTH EASTERN REGION</p>
				<h2>Early warning that understands the whole picture.</h2>
				<p>LandslideGuard AI combines terrain susceptibility, live environmental conditions, risk velocity, infrastructure exposure, and safe routes so responders can act before conditions become dangerous.</p>
				<Link to="/about" className="landing-about-link">READ THE PROJECT STORY <ArrowUpRight size={16} /></Link>
			</div>
			<div className="landing-about-grid">
				<article><MapPinned size={20} /><h3>Map vulnerability</h3><p>Identify where terrain and geology create long-term susceptibility.</p></article>
				<article><CloudRain size={20} /><h3>Monitor conditions</h3><p>Fuse rainfall, soil moisture, and forecasts as the environment changes.</p></article>
				<article><Route size={20} /><h3>Warn and respond</h3><p>Explain the warning, prioritize impact, and recommend safer routes.</p></article>
			</div>
			<div className="landing-about-footer"><span><ShieldCheck size={16} /> AI-based early warning and landslide risk monitoring system in the NER</span><Link to="/dashboard/console">{t("openConsole")} <ArrowUpRight size={15} /></Link></div>
		</section>
	</>;
}

