import Image from "next/image";

/** Small BTI mark (candles + arrow), used in tiny UI spots such as the chart toolbar. */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="btiG" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#00B894" />
          <stop offset="1" stopColor="#00F5AE" />
        </linearGradient>
      </defs>
      <rect x="5" y="30" width="7" height="12" rx="1.5" fill="url(#btiG)" />
      <rect x="15" y="23" width="7" height="19" rx="1.5" fill="url(#btiG)" />
      <rect x="25" y="16" width="7" height="26" rx="1.5" fill="url(#btiG)" />
      <path d="M4 27 L18 17 L26 21 L40 8" fill="none" stroke="url(#btiG)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33 7 L42 6 L41 15" fill="none" stroke="url(#btiG)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Official brand logo (symbol + "BTI" + "Best Trading Indicator") from /public/logo.png. */
export default function Logo({ compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Image
      src="/logo.png"
      alt="BTI – Best Trading Indicator"
      width={1672}
      height={941}
      priority
      sizes="160px"
      className={compact ? "h-10 w-auto" : "h-12 w-auto sm:h-14"}
    />
  );
}
