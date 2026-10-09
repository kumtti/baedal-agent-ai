import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlarmClock, BellRing, Copy, FileText, Send, Smartphone, Sparkles, TriangleAlert, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Card, CtaButton, FlowSteps } from "@/components/AppShell";
import { setEvent, tally, useEvent, won } from "@/lib/demo";

export const Route = createFileRoute("/collect")({
  head: () => ({
    meta: [
      { title: "실시간 단체 취합 현황 — 배민 테스트" },
      { name: "description", content: "참여자 응답률, 메뉴별 수량, 미응답자 리마인드를 AI 코치와 함께 관리하세요." },
      { property: "og:title", content: "실시간 단체 취합 현황" },
      { property: "og:description", content: "AI 취합 코치가 미응답자 리마인드까지 챙겨요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Collect,
});

function Collect() {
  const ev = useEvent();
  const nav = useNavigate();
  const { c, rows, total, missing, count } = tally(ev);
  const [nudged, setNudged] = useState<string[]>([]);
  const pct = Math.round((count / ev.members.length) * 100);

  if (ev.status === "draft" || ev.status === "recommended") {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <p className="text-lg font-bold">아직 취합 중인 단체주문이 없어요</p>
          <p className="mt-2 text-sm text-muted-foreground">AI 추천 후보를 먼저 선택해주세요.</p>
          <Link to="/" className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">새 단체주문 시작</Link>
        </div>
      </AppShell>
    );
  }

  const nudge = (names: string[]) => {
    setNudged((n) => [...n, ...names]);
    toast.success(`${names.join(", ")}님에게 리마인드 톡을 보냈어요`);
  };
  const close = () => {
    setEvent({ status: "pending_approval" });
    nav({ to: "/order" });
  };

  return (
    <AppShell footer={<CtaButton onClick={close}><FileText className="size-5" /> 지금 마감하고 AI 주문서 생성</CtaButton>}>
      <FlowSteps current={2} />
      <div className="space-y-4 p-5">
        <Card>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning"><AlarmClock className="size-3.5" /> 마감 임박</span>
            <span className="tnum font-bold text-primary-strong">01:23:45 남음</span>
          </div>
          <h1 className="mt-3 text-xl font-extrabold">{ev.title}</h1>
          <p className="text-sm text-muted-foreground">{c.name}</p>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-xs text-muted-foreground">응답률</span>
            <span><b className="tnum text-2xl text-primary-strong">{count}</b> / {ev.members.length}명 ({pct}%)</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
        </Card>

        {missing.length > 0 && (
          <section className="rounded-3xl border border-primary/30 bg-primary-soft p-4">
            <div className="flex gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-5" /></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-accent-foreground">AI 배민 취합 코치</p>
                <p className="mt-1 text-sm">미응답자 {missing.length}명(<b>{missing.join(", ")}</b>)에게 리마인드 톡을 보낼까요?</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full bg-card px-2 py-0.5">채식 선호 2명 반영</span>
                  <span className="flex items-center gap-1 rounded-full bg-destructive-soft px-2 py-0.5 text-destructive"><TriangleAlert className="size-3" /> 갑각류 알레르기 1명</span>
                </div>
                <button onClick={() => nudge(missing)} className="mt-3 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"><BellRing className="size-4" /> 전원 리마인드 발송</button>
              </div>
            </div>
          </section>
        )}

        <Link to="/p/$token" params={{ token: "demo" }} className="flex items-center gap-3 rounded-3xl border border-dashed border-primary bg-card p-4">
          <Smartphone className="size-6 text-primary-strong" />
          <div className="flex-1">
            <p className="text-sm font-bold">참여자 화면 체험하기</p>
            <p className="text-xs text-muted-foreground">로그인 없이 30초 만에 메뉴 고르는 화면</p>
          </div>
          <span className="text-sm font-bold text-primary-strong">열기</span>
        </Link>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-bold">메뉴별 실시간 취합</h2>
            <span className="tnum text-sm font-bold text-primary-strong">총 {count}개 ({won(total)})</span>
          </div>
          <div className="mt-3 space-y-2">
            {rows.map((r) => (
              <div key={r.menu.id} className="flex items-center gap-3 rounded-2xl bg-secondary p-2.5">
                <img src={r.menu.img} alt="" loading="lazy" width={816} height={816} className="size-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.menu.name}</p>
                  {r.menu.tag && <span className="text-xs text-accent-foreground">{r.menu.tag}</span>}
                </div>
                <div className="text-right"><p className="font-bold">{r.qty}개</p><p className="tnum text-xs text-muted-foreground">{won(r.total)}</p></div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-1.5 font-bold"><Users className="size-4" /> 참여자 응답 현황</h2>
          <ul className="mt-3 divide-y divide-border">
            {ev.responses.map((r) => (
              <li key={r.name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-semibold">{r.name} {r.host && <span className="ml-1 rounded bg-secondary px-1.5 text-xs font-normal">취합 호스트</span>}</span>
                <span className="text-xs font-bold text-success">{r.menuId ? c.menus.find((m) => m.id === r.menuId)?.name : "불참"}</span>
              </li>
            ))}
            {missing.map((n) => (
              <li key={n} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-semibold">{n} <span className="ml-1 rounded bg-destructive-soft px-1.5 text-xs font-normal text-destructive">미응답</span></span>
                <button onClick={() => nudge([n])} disabled={nudged.includes(n)} className="flex items-center gap-1 rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary-strong disabled:opacity-40">
                  <Send className="size-3" /> {nudged.includes(n) ? "발송됨" : "넛지 알림"}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <button onClick={() => { navigator.clipboard?.writeText(location.origin + "/p/demo"); toast("참여 링크를 복사했어요"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-bold">
          <Copy className="size-4" /> 참여 링크 복사
        </button>
      </div>
    </AppShell>
  );
}
