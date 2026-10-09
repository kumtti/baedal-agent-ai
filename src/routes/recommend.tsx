import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, CheckCircle2, ChevronDown, Link2, ShieldCheck, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { useState } from "react";
import { AiBadge, AppShell, CtaButton, FlowSteps } from "@/components/AppShell";
import { candidates, seedResponses, setEvent, useEvent, won } from "@/lib/demo";

export const Route = createFileRoute("/recommend")({
  head: () => ({
    meta: [
      { title: "AI 추천 후보 비교 — 배민 단체주문 AI" },
      { name: "description", content: "예산·인원·식이 제한을 검증한 최적 식당 후보 3곳을 비교하고 선택하세요." },
      { property: "og:title", content: "AI 추천 후보 비교" },
      { property: "og:description", content: "제휴 식당 DB 기반으로 검증된 추천 후보." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Recommend,
});

function Recommend() {
  const ev = useEvent();
  const nav = useNavigate();
  const [sel, setSel] = useState(ev.candidateId ?? candidates[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const selected = candidates.find((c) => c.id === sel) ?? candidates[0]!;

  const choose = () => {
    setEvent({ candidateId: sel, status: "collecting", responses: seedResponses(selected) });
    nav({ to: "/collect" });
  };

  return (
    <AppShell footer={<CtaButton onClick={choose}><Link2 className="size-5" /> 후보 {selected.rank}로 취합 링크 생성</CtaButton>}>
      <FlowSteps current={1} />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <AiBadge>AI CURATED</AiBadge>
          <span className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-semibold"><Calendar className="size-3.5" /> {ev.date}</span>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">{ev.title}</h1>
          <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="size-4" /> {ev.headcount}명</span>
            <span className="flex items-center gap-1"><Wallet className="size-4" /> 1인 {won(ev.budget)}</span>
          </p>
        </div>

        <section className="rounded-3xl border border-primary/30 bg-primary-soft p-4">
          <div className="flex gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-5" /></div>
            <div>
              <p className="font-bold">AI 분석 완료: 15곳 중 최적 3개 플랜</p>
              <p className="mt-1 text-xs text-muted-foreground">식이 조건 검증 · 역삼 권역 25분 내 배달 · 최소주문 충족 식당만</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11px] font-semibold text-accent-foreground">
            {["인원 취합", "알레르기 교차검증", "최적 후보 선정"].map((s) => (
              <div key={s}><div className="mb-1 h-1.5 rounded-full bg-primary" />{s}</div>
            ))}
          </div>
        </section>

        <h2 className="flex items-center gap-2 text-lg font-extrabold">비교 추천 후보 <span className="grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">3</span></h2>

        {candidates.map((c) => {
          const diff = c.perPerson - ev.budget;
          const active = sel === c.id;
          return (
            <article key={c.id} onClick={() => setSel(c.id)} className={`cursor-pointer rounded-3xl border-2 bg-card p-4 shadow-card transition ${active ? "border-primary" : "border-transparent"}`}>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${active ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>후보 {c.rank}</span>
                  {c.rank === 1 && <AiBadge>배민 매칭 1위</AiBadge>}
                  {diff > 0 && <span className="rounded-lg bg-destructive-soft px-2 py-0.5 text-xs font-bold text-destructive">예산 초과 (+{diff.toLocaleString()}원)</span>}
                </div>
                {active && <CheckCircle2 className="size-6 fill-primary text-primary-foreground" />}
              </div>
              <div className="mt-3 flex gap-3">
                <img src={c.img} alt={c.name} loading="lazy" width={816} height={816} className="size-20 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-bold leading-snug">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.category}</p>
                  <p className="mt-1 flex items-baseline gap-2 text-sm">
                    1인 예상 <b className="tnum text-xl text-primary-strong">{c.perPerson.toLocaleString()}원</b>
                    {diff <= 0 && <span className="rounded-md bg-primary-soft px-1.5 text-xs font-semibold text-accent-foreground">예산 내 ({diff.toLocaleString()}원)</span>}
                  </p>
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-secondary p-3 text-sm font-semibold"><ShieldCheck className="size-4 text-primary-strong" /> {c.highlight}</p>
              <button onClick={(e) => { e.stopPropagation(); setOpen(open === c.id ? null : c.id); }} className="mt-3 flex w-full items-center justify-between text-sm font-semibold text-muted-foreground">
                메뉴 구성 · AI 근거 보기 <ChevronDown className={`size-4 transition ${open === c.id ? "rotate-180" : ""}`} />
              </button>
              {open === c.id && (
                <div className="mt-2 space-y-2 border-t border-border pt-3 text-sm">
                  <p className="flex gap-1.5"><TrendingUp className="mt-0.5 size-4 shrink-0 text-primary-strong" /> <span><b className="text-primary-strong">배민 AI 근거:</b> {c.reason}</span></p>
                  {c.menus.map((m) => (
                    <div key={m.id} className="flex justify-between"><span>{m.name}</span><span className="tnum text-muted-foreground">{won(m.price)}</span></div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
        <p className="text-center text-xs text-muted-foreground">AI는 제휴 식당 DB의 가격·메뉴만 사용하며, 금액 계산은 시스템이 수행해요.</p>
      </div>
    </AppShell>
  );
}
