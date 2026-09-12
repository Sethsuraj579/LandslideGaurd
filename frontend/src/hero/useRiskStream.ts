import { useEffect, useRef, useState } from 'react';

export type RiskPayload = { risk: number; level: 'LOW' | 'WATCH' | 'WARNING' | 'CRITICAL' };
type SummaryResponse = { average_risk?: number; latest?: Array<{ fused_risk: number; level: RiskPayload['level'] }> };

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000';
const WS_BASE  = API_BASE.replace(/^http/, 'ws');

const FALLBACK: RiskPayload = { risk: 48, level: 'WATCH' };

export function useRiskStream() {
  const [data, setData] = useState<RiskPayload>(FALLBACK);
  const [offline, setOffline] = useState(false);
  const pending = useRef<RiskPayload | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let poll: number | null = null;
    let closed = false;

    const commit = () => {
      raf.current = 0;
      if (pending.current) { setData(pending.current); pending.current = null; }
    };
    const push = (p: RiskPayload) => {
      if (!Number.isFinite(p.risk) || !p.level) return;
      pending.current = p;
      if (!raf.current) raf.current = requestAnimationFrame(commit);
    };

    const readSummary = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/risk/summary/`);
        if (!response.ok) throw new Error('Risk summary unavailable');
        const summary = (await response.json()) as SummaryResponse;
        const latest = summary.latest?.[0];
        const risk = latest?.fused_risk ?? summary.average_risk;
        const level = latest?.level ?? (risk !== undefined && risk >= 70 ? 'CRITICAL' : risk !== undefined && risk >= 50 ? 'WARNING' : 'WATCH');
        if (risk !== undefined) push({ risk: Number(risk.toFixed(1)), level });
        setOffline(false);
      } catch {
        setOffline(true);
      }
    };

    const startPolling = () => {
      if (poll) return;
      void readSummary();
      poll = window.setInterval(() => void readSummary(), 10_000);
    };

    const connect = () => {
      try {
        ws = new WebSocket(`${WS_BASE}/ws/risk/`);
      } catch { setOffline(true); startPolling(); return; }

      ws.onopen = () => { setOffline(false); if (poll) { clearInterval(poll); poll = null; } };
      ws.onmessage = (e) => {
        try { push(JSON.parse(e.data) as RiskPayload); } catch {}
      };
      ws.onclose = () => { setOffline(true); startPolling(); };
      ws.onerror = () => { /* onclose will follow */ };
    };

    void readSummary();
    connect();
    return () => {
      closed = true;
      if (ws) { ws.onclose = null; ws.close(); }
      if (poll) clearInterval(poll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return { ...data, offline };
}
