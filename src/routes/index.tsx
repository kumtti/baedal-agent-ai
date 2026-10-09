import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, CheckCircle2, Clock, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { AppShell, Card } from "@/components/AppShell";
import { candidates, resetDemo, useEvent, won } from "@/lib/demo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "배민 단체주문 AI 비서 — 회사 단체주문을 AI가 대신" },
      { name: "description", content: "행사 조건만 말하면 AI가 식당 추천, 메뉴 취합, 주문서 작성까지. 담당자는 승인만 하세요." },
      { property: "og:title", content: "배민 단체주문 AI 비서" },
      { property: "og:description", content: "추천·취합·발주까지 AI 에이전트가 함께하는 회사 단체주문." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const chips = ["🔥 팀 인기 베스트", "🥗 비건/알레르기 케어", "⏱ 30분 내 도착", "💼 워크숍 대량"];

function Home() {
  const nav = useNavigate();
  const ev = useEvent();
  const [q, setQ] = useState("다음주 목요일 12시, 12명 팀 점심. 1인 15,000원, 비건 2명 포함");
  const go = () => nav({ to: "/events/new", search: { q } });

  return (
    <AppShell>
      <div className="space-y-5 p-5">
        <section className="rounded-3xl bg-hero p-5 text-primary-foreground shadow-cta">
          <p className="flex items-center gap-1 text-xs font-bold opacity-90">
            <Sparkles className="size-3.5" /> AI 배민 단체비서 브리핑
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-snug">
            회사 단체주문,
            <br />
            말만 하면 AI가 준비해요
          </h1>
          <p className="mt-2 text-sm opacity-90">추천 → 메뉴 취합 → 주문서 작성까지. 담당자는 승인만.</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary-foreground/15 px-3 py-2 text-xs font-semibold">
            <span className="flex items-center gap-1"><CheckCircle2 className="size-4" /> 예산 오차 0% 보장 필터</span>
            <span>48시간 전 사전예약</span>
          </div>
        </section>

        <Card>
          <label htmlFor="ask" className="text-sm font-bold">어떤 단체주문이 필요하세요?</label>
          <div className="mt-3 flex items-end gap-2 rounded-2xl border border-primary/40 bg-primary-soft/50 p-3">
            <textarea id="ask" value={q} onChange={(e) => setQ(e.target.value)} rows={2} className="flex-1 resize-none bg-transparent text-sm outline-none" />
            <button onClick={go} aria-label="AI에게 요청" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <ArrowUp className="size-5" />
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {chips.map((c) => (
              <button key={c} onClick={() => setQ((v) => v + " · " + c.slice(2))} className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold">
                {c}
              </button>
            ))}
          </div>
        </Card>

        {ev.status !== "draft" && (
          <Card>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-accent-foreground">진행 중</span>
              <span className="flex items-center gap-1 text-xs font-bold text-primary-strong"><Clock className="size-3.5" /> {ev.date}</span>
            </div>
            <h2 className="mt-2 text-lg font-bold">{ev.title}</h2>
            <p className="text-sm text-muted-foreground">{ev.headcount}명 · 1인 {won(ev.budget)}</p>
            <div className="mt-3 flex gap-2">
              <Link to={ev.status === "recommended" ? "/recommend" : ev.status === "collecting" ? "/collect" : "/order"} className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-primary-foreground">
                이어서 진행
              </Link>
              <button onClick={resetDemo} className="rounded-xl border border-border px-3 text-sm font-semibold text-muted-foreground">처음부터</button>
            </div>
          </Card>
        )}

        <div>
          <p className="text-xs font-bold text-primary-strong">배민 단체 AI 앙상블 추천</p>
          <div className="mt-1 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">사전 검증 단체 전용 큐레이션</h2>
            <Link to="/events/new" search={{ q: "" }} className="flex items-center text-sm text-muted-foreground">전체 <ArrowRight className="size-4" /></Link>
          </div>
        </div>
        {candidates.slice(0, 2).map((c) => (
          <Card key={c.id}>
            <div className="flex gap-3">
              <img src={c.img} alt={c.name} loading="lazy" width={816} height={816} className="size-24 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-bold">{c.name}</h3>
                  <span className="shrink-0 rounded-md bg-primary-soft px-1.5 py-0.5 text-[11px] font-bold text-accent-foreground">적합도 {c.fit}%</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{c.category}</p>
                <p className="mt-2 flex items-center gap-1 text-xs"><Star className="size-3.5 fill-chart-4 text-chart-4" /> <b>4.9</b> · 단체리뷰 1,248건 · 배달 {c.leadMin}분</p>
                <span className="mt-2 inline-block rounded-md bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">최소주문 {won(c.minOrder)} 충족</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
