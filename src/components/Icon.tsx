import { BarChart3, Bell, Clock, Layers, ShieldCheck, Target, MonitorPlay, TrendingUp, Activity, Zap, type LucideProps } from "lucide-react";

const MAP = { target: Target, bars: BarChart3, bell: Bell, layers: Layers, tv: MonitorPlay, clock: Clock, shield: ShieldCheck, trend: TrendingUp, activity: Activity, zap: Zap };
export const ICON_NAMES = Object.keys(MAP);

export default function Icon({ name, ...p }: { name?: string } & LucideProps) {
  const C = MAP[(name as keyof typeof MAP) ?? "target"] ?? Target;
  return <C aria-hidden {...p} />;
}
