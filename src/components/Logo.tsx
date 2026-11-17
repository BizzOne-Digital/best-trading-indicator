/** Original BTI logo: ascending candle bars with an integrated up-arrow + italic wordmark. */
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

export default function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const fg = light ? "#050B15" : "#F8FAFC";
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={compact ? 32 : 40} />
      <span className="font-head text-[28px] font-extrabold italic leading-none tracking-tight" style={{ color: fg }}>BTI</span>
      {!compact && (
        <span className="hidden border-l pl-2.5 text-[13px] font-semibold leading-tight sm:block" style={{ color: fg, borderColor: light ? "#c8d3e0" : "#2b3c52" }}>
          Best Trading
          <br />
          Indicator
        </span>
      )}
    </span>
  );
}
