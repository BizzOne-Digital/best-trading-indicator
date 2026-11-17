import { Reveal } from "./ui";

export function Eyebrow({ children, pill, light }: { children: React.ReactNode; pill?: boolean; light?: boolean }) {
  return pill ? (
    <span className={`inline-block rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${light ? "border-accent2/40 bg-accent/20 text-[#047857]" : "border-accent/40 bg-accent/10 text-accent"}`}>{children}</span>
  ) : (
    <span className="text-sm font-bold uppercase tracking-wider text-accent">{children}</span>
  );
}

export function SectionHead({ eyebrow, title, sub, light, center = true }: { eyebrow?: string; title: string; sub?: string; light?: boolean; center?: boolean }) {
  return (
    <Reveal className={`mb-10 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>
      {eyebrow && <Eyebrow pill light={light}>{eyebrow}</Eyebrow>}
      <h2 className={`mt-3 text-3xl font-extrabold sm:text-4xl ${light ? "text-[#0b1220]" : "text-white"}`}>{title}</h2>
      {sub && <p className={`mt-3 text-base sm:text-lg ${light ? "text-[#3c4a5c]" : "text-muted"}`}>{sub}</p>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pt-40">
      <div className="grid-bg absolute inset-0" />
      <div className="glow animate-drift left-[-10%] top-0 h-80 w-[40rem] bg-accent/15" />
      <div className="relative mx-auto max-w-[1320px] px-4 text-center sm:px-6">
        <Eyebrow pill>{eyebrow}</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        {sub && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1320px] px-4 sm:px-6 ${className}`}>{children}</div>;
}
