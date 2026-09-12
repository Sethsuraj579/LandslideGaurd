export const riskSocketUrl = (): string => `${import.meta.env.VITE_WS_BASE_URL ?? "ws://localhost:8000"}/ws/risk/`;

