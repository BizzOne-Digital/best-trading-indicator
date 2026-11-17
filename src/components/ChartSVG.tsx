import { computeOverlay, makeCandles } from "@/lib/chart";

type Props = { overlay?: boolean; seed?: number; n?: number; showAxes?: boolean; brand?: boolean; className?: string; title?: string };

/** Illustrative TradingView-style candlestick chart rendered as pure SVG (no JS needed). */
export default function ChartSVG({ overlay = true, seed = 7, n = 96, showAxes = true, brand = true, className, title = "Illustrative BTI chart" }: Props) {
  const candles = makeCandles(n, seed);
  const ov = computeOverlay(candles);
  const W = 1000, H = 520, padR = showAxes ? 80 : 10, padB = showAxes ? 34 : 10, padT = 20;
  const lo = Math.min(...candles.map((c) => c.l)) - 300, hi = Math.max(...candles.map((c) => c.h)) + 300;
  const y = (p: number) => padT + ((hi - p) / (hi - lo)) * (H - padT - padB);
  const step = (W - padR - 10) / n;
  const x = (i: number) => 10 + i * step + step / 2;
  const bw = Math.max(2, step * 0.6);

  // Build zone polygons per contiguous trend segment.
  const zones: { d: string; up: boolean }[] = [];
  if (overlay) {
    let s = 0;
    for (let i = 1; i <= n; i++) {
      if (i === n || ov.trend[i] !== ov.trend[s]) {
        const idx = Array.from({ length: i - s + (i < n ? 1 : 0) }, (_, k) => s + k).filter((k) => k < n);
        const top = idx.map((k) => `${x(k).toFixed(1)},${y(ov.fast[k]).toFixed(1)}`);
        const bot = idx.slice().reverse().map((k) => `${x(k).toFixed(1)},${y(ov.slow[k]).toFixed(1)}`);
        zones.push({ d: `M${top.join("L")}L${bot.join("L")}Z`, up: ov.trend[s] === 1 });
        s = i;
      }
    }
  }
  const ticks = 6;
  const priceTicks = Array.from({ length: ticks }, (_, i) => lo + ((hi - lo) * (i + 0.5)) / ticks);
  const times = ["12:00", "18:00", "21", "06:00", "12:00", "18:00", "22"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={title} preserveAspectRatio="none">
      <title>{title}</title>
      <rect width={W} height={H} fill="#0b1320" />
      {priceTicks.map((p, i) => (
        <g key={i}>
          <line x1={0} x2={W - padR} y1={y(p)} y2={y(p)} stroke="#1a2738" strokeWidth={1} />
          {showAxes && <text x={W - padR + 8} y={y(p) + 4} fill="#7d8ca1" fontSize={13} fontFamily="var(--font-mono)">{Math.round(p / 100) * 100}</text>}
        </g>
      ))}
      {times.map((t, i) => {
        const xx = 10 + ((W - padR - 20) * (i + 0.5)) / times.length;
        return (
          <g key={i}>
            <line x1={xx} x2={xx} y1={padT} y2={H - padB} stroke="#152132" strokeWidth={1} />
            {showAxes && <text x={xx} y={H - 10} fill="#7d8ca1" fontSize={13} textAnchor="middle" fontFamily="var(--font-mono)">{t}</text>}
          </g>
        );
      })}
      {zones.map((z, i) => (
        <path key={i} d={z.d} fill={z.up ? "rgba(0,217,139,0.55)" : "rgba(255,64,85,0.5)"} stroke={z.up ? "#00d98b" : "#ff4055"} strokeWidth={1} />
      ))}
      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const col = up ? "#00d98b" : "#ff4055";
        return (
          <g key={i}>
            <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={1.2} />
            <rect x={x(i) - bw / 2} y={y(Math.max(c.o, c.c))} width={bw} height={Math.max(1.5, Math.abs(y(c.o) - y(c.c)))} fill={col} />
          </g>
        );
      })}
      {overlay &&
        ov.signals.map((s, k) => {
          const c = candles[s.i];
          const buy = s.type === "buy";
          const yy = buy ? y(c.l) + 22 : y(c.h) - 40;
          return (
            <g key={k}>
              <rect x={x(s.i) - 26} y={yy} width={52} height={22} rx={4} fill={buy ? "#00c47d" : "#ff2e48"} />
              <text x={x(s.i)} y={yy + 15} fill="#fff" fontSize={13} fontWeight={700} textAnchor="middle" fontFamily="var(--font-sans)">{buy ? "Buy" : "Sell"}</text>
            </g>
          );
        })}
      {brand && (
        <g transform="translate(24,34)">
          <text x={0} y={0} fill="#cbd5e1" fontSize={13} fontFamily="var(--font-mono)">BTCUSDT · 15 · ILLUSTRATIVE</text>
          {overlay && <text x={0} y={36} fill="#fff" fontSize={30} fontWeight={800} fontStyle="italic" fontFamily="var(--font-head)">BTI</text>}
        </g>
      )}
    </svg>
  );
}
