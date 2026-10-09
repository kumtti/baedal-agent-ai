import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { AppShell, CtaButton } from "@/components/AppShell";
import { selectedCandidate, setEvent, tally, useEvent, won } from "@/lib/demo";

export const Route = createFileRoute("/p/$token")({
  head: () => ({
    meta: [
      { title: "메뉴 고르기 — 배민 단체주문" },
      { name: "description", content: "로그인 없이 30초 만에 단체주문 메뉴를 선택하세요." },
      { property: "og:title", content: "단체주문 메뉴 고르기" },
      { property: "og:description", content: "메뉴 탭 → 이름 → 제출. 끝." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Participant,
});

function Participant() {
  const ev = useEvent();
  const c = selectedCandidate(ev);
  const { missing } = tally(ev);
  const [menu, setMenu] = useState<string | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [allergy, setAllergy] = useState("");
  const [done, setDone] = useState(false);

  const submit = () => {
    setEvent((s) => ({ responses: [...s.responses.filter((r) => r.name !== name), { name, menuId: menu ?? null, allergy }] }));
    setDone(true);
  };

  if (done) {
    const m = c.menus.find((x) => x.id === menu);
    return (
      <AppShell header={false} nav={false}>
        <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
          <CheckCircle2 className="size-16 fill-primary text-primary-foreground" />
          <h1 className="mt-4 text-2xl font-extrabold">응답 완료!</h1>
          <p className="mt-2 text-muted-foreground">{name}님 · {m ? m.name : "불참"}</p>
          <p className="mt-1 text-xs text-muted-foreground">마감 전까지 이 링크에서 수정할 수 있어요.</p>
          <Link to="/collect" className="mt-8 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background">담당자 화면으로 돌아가기</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell header={false} nav={false} footer={<CtaButton disabled={menu === undefined || !name.trim()} onClick={submit}>제출하기</CtaButton>}>
      <div className="space-y-4 p-5">
        <div className="rounded-3xl bg-hero p-5 text-primary-foreground">
          <p className="text-xs font-bold opacity-90">{ev.team} 단체주문</p>
          <h1 className="mt-1 text-xl font-extrabold">{ev.title}</h1>
          <p className="mt-1 text-sm opacity-90">{ev.date} · {c.name}</p>
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-foreground/20 px-2.5 py-1 text-xs font-bold"><Clock className="size-3.5" /> 마감까지 01:23:45</p>
        </div>
        <h2 className="font-bold">1. 메뉴를 골라주세요</h2>
        <div className="grid grid-cols-2 gap-3">
          {c.menus.map((m) => {
            const over = m.price > ev.budget;
            return (
              <button key={m.id} onClick={() => setMenu(m.id)} className={`overflow-hidden rounded-2xl border-2 bg-card text-left shadow-card ${menu === m.id ? "border-primary" : "border-transparent"}`}>
                <img src={m.img} alt={m.name} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover" />
                <div className="p-2.5">
                  <p className="text-sm font-bold leading-tight">{m.name}</p>
                  <p className={`tnum mt-1 text-sm font-bold ${over ? "text-destructive" : "text-primary-strong"}`}>{won(m.price)}</p>
                  {m.tag && <span className="mt-1 inline-block rounded bg-primary-soft px-1.5 text-[11px] font-semibold text-accent-foreground">{m.tag}</span>}
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={() => setMenu(null)} className={`h-12 w-full rounded-2xl border-2 text-sm font-bold ${menu === null ? "border-primary bg-primary-soft" : "border-border bg-card"}`}>이번엔 불참할게요</button>
        <h2 className="pt-2 font-bold">2. 이름</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} list="names" placeholder="예: 박민우" className="h-12 w-full rounded-xl border border-input bg-card px-3 outline-none focus:border-primary" />
        <datalist id="names">{missing.map((n) => <option key={n} value={n} />)}</datalist>
        <input value={allergy} onChange={(e) => setAllergy(e.target.value)} placeholder="알레르기 (선택)" className="h-12 w-full rounded-xl border border-input bg-card px-3 outline-none focus:border-primary" />
      </div>
    </AppShell>
  );
}
