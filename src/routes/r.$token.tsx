import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Clock } from "lucide-react";
import { AppShell, Card, CtaButton } from "@/components/AppShell";
import { setEvent, tally, useEvent, won } from "@/lib/demo";

export const Route = createFileRoute("/r/$token")({
  head: () => ({
    meta: [
      { title: "단체 발주서 확인 — 배민 테스트" },
      { name: "description", content: "들어온 단체 발주서를 확인하고 수락 또는 거절하세요." },
      { property: "og:title", content: "단체 발주서 확인" },
      { property: "og:description", content: "확정된 대량 주문을 미리 받아보세요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Restaurant,
});

function Restaurant() {
  const ev = useEvent();
  const nav = useNavigate();
  const { c, rows, total, count } = tally(ev);
  const act = (ok: boolean) => {
    setEvent({ status: ok ? "confirmed" : "rejected" });
    nav({ to: "/order" });
  };
  return (
    <AppShell header={false} nav={false} footer={ev.status === "dispatched" ? (
      <div className="grid grid-cols-3 gap-2">
        <CtaButton variant="outline" onClick={() => act(false)}>거절</CtaButton>
        <div className="col-span-2"><CtaButton onClick={() => act(true)}>주문 수락</CtaButton></div>
      </div>
    ) : undefined}>
      <div className="space-y-4 p-5">
        <p className="pt-2 text-xs font-bold text-primary-strong">배민 사장님 · 단체 발주서</p>
        <h1 className="text-2xl font-extrabold">{c.name}</h1>
        <Card className="space-y-2 text-sm">
          <p className="flex gap-2"><Clock className="size-4 text-primary-strong" /> {ev.date} 도착</p>
          <p className="flex gap-2"><MapPin className="size-4 text-primary-strong" /> {ev.address}</p>
          <p className="text-xs text-muted-foreground">응답 기한: 발주 후 12시간 · 수수료 8%</p>
        </Card>
        <Card>
          {rows.map((r) => (
            <div key={r.menu.id} className="flex justify-between border-b border-border py-2.5 text-sm last:border-0">
              <span>{r.menu.name} × {r.qty}</span><b className="tnum">{won(r.total)}</b>
            </div>
          ))}
          <div className="mt-3 flex justify-between text-lg font-extrabold"><span>합계 ({count}개)</span><span className="tnum text-primary-strong">{won(total)}</span></div>
        </Card>
        {ev.status !== "dispatched" && <p className="text-center text-sm text-muted-foreground">이미 처리된 발주서예요.</p>}
      </div>
    </AppShell>
  );
}
