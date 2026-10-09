import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlarmClock, Check, Clock, Hourglass, Leaf, Send, Sparkles, TriangleAlert, Utensils } from "lucide-react";
import { useState } from "react";
import { AppShell, Card, CtaButton, FlowSteps } from "@/components/AppShell";
import { setEvent, tally, useEvent, won } from "@/lib/demo";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "AI 주문서 승인 — 배민 테스트" },
      { name: "description", content: "AI가 작성한 주문서 초안을 검토하고 승인하면 식당에 발주됩니다." },
      { property: "og:title", content: "AI 주문서 승인" },
      { property: "og:description", content: "사람 승인 없이는 발주되지 않아요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Order,
});

const stage = ["취합 완료", "승인 대기", "발주 전송", "최종 확정"];

function Order() {
  const ev = useEvent();
  const nav = useNavigate();
  const { c, rows, total, missing, count } = tally(ev);
  const [confirm, setConfirm] = useState(false);
  const budgetTotal = ev.headcount * ev.budget;
  const idx = ev.status === "pending_approval" ? 1 : ev.status === "dispatched" ? 2 : ev.status === "confirmed" ? 3 : 0;

  if (!["pending_approval", "dispatched", "confirmed", "rejected"].includes(ev.status)) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <p className="text-lg font-bold">승인할 주문서가 없어요</p>
          <p className="mt-2 text-sm text-muted-foreground">취합을 마감하면 AI가 주문서 초안을 만들어요.</p>
          <Link to="/collect" className="mt-5 inline-block rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">취합 현황 보기</Link>
        </div>
      </AppShell>
    );
  }

  const approve = () => {
    setEvent({ status: "dispatched" });
    setConfirm(false);
  };

  const footer =
    ev.status === "pending_approval" ? (
      <CtaButton onClick={() => setConfirm(true)}><Send className="size-5" /> 승인하고 식당에 발주하기 ({won(total)})</CtaButton>
    ) : ev.status === "dispatched" ? (
      <CtaButton variant="outline" onClick={() => nav({ to: "/r/$token", params: { token: "demo" } })}>🧑‍🍳 사장님 화면에서 수락 체험하기</CtaButton>
    ) : undefined;

  return (
    <AppShell footer={footer}>
      <FlowSteps current={ev.status === "confirmed" ? 4 : 3} />
      <div className="space-y-4 p-5">
        <Card>
          <ol className="flex justify-between">
            {stage.map((s, i) => (
              <li key={s} className="flex flex-1 flex-col items-center gap-1 text-xs font-semibold">
                <span className={`grid size-9 place-items-center rounded-full ${i < idx ? "bg-primary text-primary-foreground" : i === idx ? "bg-primary-soft text-primary-strong ring-2 ring-primary" : "bg-secondary text-muted-foreground"}`}>
                  {i < idx ? <Check className="size-4" /> : i === idx ? <Hourglass className="size-4" /> : <span>{i + 1}</span>}
                </span>
                <span className={i === idx ? "text-primary-strong" : "text-muted-foreground"}>{s}</span>
              </li>
            ))}
          </ol>
        </Card>

        {ev.status === "confirmed" && (
          <section className="rounded-3xl bg-success-soft p-5 text-center">
            <Check className="mx-auto size-10 text-success" />
            <p className="mt-2 text-lg font-extrabold text-success">발주 확정! 사장님이 주문을 수락했어요</p>
            <p className="mt-1 text-sm text-muted-foreground">{ev.date} 정시 도착 예정 · 법인카드 결제 안내가 발송됐어요</p>
          </section>
        )}
        {ev.status === "rejected" && (
          <section className="rounded-3xl bg-destructive-soft p-5">
            <p className="font-bold text-destructive">식당이 주문을 거절했어요</p>
            <p className="mt-1 text-sm">AI가 차순위 후보로 재추천을 준비했어요.</p>
            <Link to="/recommend" className="mt-3 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">차순위 후보 보기</Link>
          </section>
        )}

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">결제 예정 총액 ({count}인)</span>
            <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-accent-foreground">{won(budgetTotal - total)} 절감</span>
          </div>
          <p className="tnum mt-2 text-4xl font-black">{total.toLocaleString()}<span className="text-xl">원</span></p>
          <div className="mt-3 flex justify-between rounded-2xl bg-secondary p-3 text-sm">
            <span className="text-muted-foreground">총 지원 예산 {won(budgetTotal)}</span>
            <b className="text-primary-strong">잔여 {Math.round(((budgetTotal - total) / budgetTotal) * 100)}%</b>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <img src={c.img} alt={c.name} loading="lazy" width={816} height={816} className="size-16 rounded-2xl object-cover" />
          <div>
            <p className="font-bold">{c.name}</p>
            <p className="mt-1 flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="size-3.5" /> 리드타임 {c.leadMin}분</span>
              <span className={`flex items-center gap-1 ${total >= c.minOrder ? "text-success" : "text-warning"}`}><Check className="size-3.5" /> 최소주문 {total >= c.minOrder ? "충족" : "미달"}</span>
            </p>
          </div>
        </Card>

        <section className="rounded-3xl border border-primary/30 bg-primary-soft p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 font-bold text-accent-foreground"><Sparkles className="size-4" /> AI 초안 발주서</p>
            <span className="rounded-full bg-card px-2 py-0.5 text-xs font-semibold">AI 작성 · 사람 승인 필요</span>
          </div>
          <ul className="mt-3 space-y-2 rounded-2xl bg-card p-3 text-sm">
            <li className="flex gap-2"><AlarmClock className="size-4 shrink-0 text-primary-strong" /> <span><b>12:00 정각 도착 요청</b> ({ev.address})</span></li>
            <li className="flex gap-2"><Leaf className="size-4 shrink-0 text-primary-strong" /> 비건 메뉴 별도 라벨 스티커 부착 요청</li>
            <li className="flex gap-2"><TriangleAlert className="size-4 shrink-0 text-destructive" /> 갑각류 알레르기 1명 — 교차오염 주의 요청</li>
            <li className="flex gap-2"><Utensils className="size-4 shrink-0 text-primary-strong" /> 수저/물티슈 {count}세트 동봉</li>
          </ul>
          {missing.length > 0 && <p className="mt-2 text-xs text-warning">미응답 {missing.length}명({missing.join(", ")})은 정책에 따라 주문에서 제외됐어요.</p>}
        </section>

        <Card>
          <h2 className="font-bold">주문 상세 명세서</h2>
          <div className="mt-3 space-y-2">
            {rows.map((r) => (
              <div key={r.menu.id} className="flex items-center justify-between rounded-2xl bg-secondary p-3">
                <div>
                  <p className="text-sm font-semibold">{r.menu.name} {r.menu.tag && <span className="ml-1 rounded bg-card px-1.5 text-xs">{r.menu.tag}</span>}</p>
                  <p className="text-xs text-muted-foreground">단가 {won(r.menu.price)} × {r.qty}</p>
                </div>
                <b className="tnum">{won(r.total)}</b>
              </div>
            ))}
            <div className="flex justify-between rounded-2xl border border-primary/30 p-3 text-sm"><span>🛵 배민 단체 주문 무료 배달</span><b className="text-primary-strong">0원</b></div>
          </div>
        </Card>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40" onClick={() => setConfirm(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-extrabold">{c.name}에 발주할까요?</h3>
            <p className="mt-2 text-sm text-muted-foreground">총 {count}개 · {won(total)}. 발주 후 사장님이 12시간 안에 수락하면 확정돼요.</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <CtaButton variant="outline" onClick={() => setConfirm(false)}>취소</CtaButton>
              <CtaButton onClick={approve}>발주하기</CtaButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
