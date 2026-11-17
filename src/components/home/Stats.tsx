import { CalendarDays, Infinity as Inf, Globe2, MonitorPlay, Users, Star } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import type { Settings } from "@/lib/defaults";

export default function Stats({ t, s }: { t: Dict; s: Settings }) {
  const items: [typeof Users, string, string][] = [
    [CalendarDays, t.stats.years, t.stats.yearsSub],
    [MonitorPlay, t.stats.tv, t.stats.tvSub],
    [Inf, t.stats.plans, t.stats.plansSub],
    [Globe2, t.stats.markets, t.stats.marketsSub],
  ];
  // Customer count / rating appear only once verified and enabled in admin.
  if (s.showTraderCount && s.traderCount) items.unshift([Users, s.traderCount, ""]);
  if (s.showRating && s.ratingText) items.push([Star, s.ratingText, ""]);
  return (
    <section className="border-y border-line/70 bg-bg2/70">
      <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-6 px-4 py-7 sm:px-6 lg:flex lg:justify-between">
        {items.map(([I, a, b], i) => (
          <div key={i} className={`flex items-center gap-3 lg:px-6 ${i ? "lg:border-l lg:border-line" : ""}`}>
            <I className="h-9 w-9 shrink-0 text-accent" aria-hidden />
            <div>
              <div className="font-head text-lg font-bold leading-tight">{a}</div>
              {b && <div className="text-sm text-muted">{b}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
