import { Link, useLocation } from "@tanstack/react-router";
import { Bell, ChevronDown, ClipboardList, Compass, MapPin, Sparkles, User, Users } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "홈/탐색", icon: Compass },
  { to: "/recommend", label: "AI 추천", icon: Sparkles },
  { to: "/collect", label: "단체 취합", icon: Users },
  { to: "/order", label: "주문서", icon: ClipboardList },
  { to: "/login", label: "my배민", icon: User },
] as const;

export function AppShell({ children, header = true, nav = true, footer }: { children: ReactNode; header?: boolean; nav?: boolean; footer?: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-secondary">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-card">
        {header && (
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 px-5 py-3 backdrop-blur">
            <div>
              <button className="flex items-center gap-1 text-base font-bold">
                <MapPin className="size-4 text-primary-strong" /> 강남구 테헤란로 152 <ChevronDown className="size-4" />
              </button>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                <span className="size-1.5 rounded-full bg-primary animate-dot" /> 배민 AI 단체비서 On
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="알림" className="relative grid size-10 place-items-center rounded-full bg-secondary">
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
              </button>
              <div className="grid size-10 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">배민</div>
            </div>
          </header>
        )}
        <main className={`flex-1 ${nav ? "pb-24" : ""} ${footer ? "pb-32" : ""}`}>{children}</main>
        {footer && (
          <div className={`fixed inset-x-0 z-30 mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent px-5 pb-4 pt-6 ${nav ? "bottom-16" : "bottom-0"}`}>
            {footer}
          </div>
        )}
        {nav && (
          <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid h-16 max-w-md grid-cols-5 border-t border-border bg-card">
            {tabs.map((t) => {
              const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
              return (
                <Link key={t.to} to={t.to} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? "text-primary-strong" : "text-muted-foreground"}`}>
                  <t.icon className="size-5" />
                  {t.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-border bg-card p-5 shadow-card ${className}`}>{children}</section>;
}

export function AiBadge({ children = "AI 추천" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-accent-foreground">
      <Sparkles className="size-3" /> {children}
    </span>
  );
}

export function CtaButton({ children, onClick, disabled, variant = "primary" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; variant?: "primary" | "outline" }) {
  const base = "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition active:scale-[0.98] disabled:opacity-40";
  const v = variant === "primary" ? "bg-primary text-primary-foreground shadow-cta hover:bg-primary-strong" : "border border-border bg-card text-foreground";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${v}`}>
      {children}
    </button>
  );
}

const steps = ["행사 생성", "AI 추천", "취합", "승인", "확정"];
export function FlowSteps({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1 px-5 pt-4">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-1 flex-col gap-1">
          <span className={`h-1.5 rounded-full ${i <= current ? "bg-primary" : "bg-border"}`} />
          <span className={`text-[11px] font-semibold ${i === current ? "text-primary-strong" : "text-muted-foreground"}`}>{s}</span>
        </li>
      ))}
    </ol>
  );
}
