// Deterministic, illustrative candle data. NOT live market data.
export type Candle = { o: number; h: number; l: number; c: number };

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function makeCandles(n = 96, seed = 7, start = 67000): Candle[] {
  const r = rng(seed);
  const out: Candle[] = [];
  let price = start;
  for (let i = 0; i < n; i++) {
    // Up-leg, distribution, down-leg, recovery: gives clear structure for the overlay.
    const phase = i / n;
    const drift = phase < 0.35 ? 70 : phase < 0.45 ? 0 : phase < 0.72 ? -75 : 60;
    const o = price;
    const c = o + drift + (r() - 0.5) * 420;
    const h = Math.max(o, c) + r() * 180;
    const l = Math.min(o, c) - r() * 180;
    out.push({ o, h, l, c });
    price = c;
  }
  return out;
}

function ema(vals: number[], len: number) {
  const k = 2 / (len + 1);
  const out: number[] = [];
  vals.forEach((v, i) => out.push(i === 0 ? v : v * k + out[i - 1] * (1 - k)));
  return out;
}

export type Overlay = { fast: number[]; slow: number[]; trend: (1 | -1)[]; signals: { i: number; type: "buy" | "sell" }[] };

export function computeOverlay(c: Candle[]): Overlay {
  const closes = c.map((x) => x.c);
  const fast = ema(closes, 6), slow = ema(closes, 18);
  const trend = fast.map((f, i) => (f >= slow[i] ? 1 : -1)) as (1 | -1)[];
  const signals: Overlay["signals"] = [];
  let last = -99;
  for (let i = 8; i < c.length; i++) {
    if (trend[i] !== trend[i - 1] && i - last > 8) {
      signals.push({ i, type: trend[i] === 1 ? "buy" : "sell" });
      last = i;
    }
  }
  return { fast, slow, trend, signals };
}
