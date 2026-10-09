import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell, Card, CtaButton, FlowSteps } from "@/components/AppShell";
import { setEvent, useEvent, won } from "@/lib/demo";

export const Route = createFileRoute("/events/new")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  head: () => ({
    meta: [
      { title: "새 단체주문 만들기 — 배민 단체주문 AI" },
      { name: "description", content: "AI가 요청 문장에서 일시·인원·예산·식이 제한을 정리해 행사를 만듭니다." },
      { property: "og:title", content: "새 단체주문 만들기" },
      { property: "og:description", content: "말로 요청하면 AI가 행사 조건을 정리합니다." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewEvent,
});

const thinking = ["요청 문장 분석 중", "일시·인원·예산 추출", "식이 제한 확인", "리드타임(48h) 검증"];

function NewEvent() {
  const { q } = Route.useSearch();
  const ev = useEvent();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: ev.title, date: ev.date, address: ev.address, headcount: ev.headcount, budget: ev.budget });

  useEffect(() => {
    if (step >= thinking.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 600);
    return () => clearTimeout(t);
  }, [step]);
  const done = step >= thinking.length;

  const submit = () => {
    setEvent({ ...form, status: "recommended", responses: [], candidateId: null });
    nav({ to: "/recommend" });
  };

  return (
    <AppShell footer={done ? <CtaButton onClick={submit}><Sparkles className="size-5" /> 이 조건으로 AI 식당 추천받기</CtaButton> : undefined}>
      <FlowSteps current={0} />
      <div className="space-y-4 p-5">
        <div className="ml-auto max-w-[85%] rounded-3xl rounded-br-md bg-foreground px-4 py-3 text-sm text-background">
          {q || "다음주 목요일 12시, 12명 팀 점심. 1인 15,000원, 비건 2명 포함"}
        </div>
        <div className="flex gap-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">AI</div>
          <div className="flex-1 space-y-1.5 pt-1">
            {thinking.map((t, i) => (
              <p key={t} className={`flex items-center gap-2 text-sm ${i < step ? "text-foreground" : i === step ? "text-primary-strong" : "text-muted-foreground/50"}`}>
                {i < step ? <Check className="size-4 text-success" /> : i === step ? <Loader2 className="size-4 animate-spin" /> : <span className="size-4" />}
                {t}
              </p>
            ))}
            {done && <p className="pt-2 text-sm">요청을 정리했어요. 확인 후 수정할 부분이 있으면 바로 고쳐주세요.</p>}
          </div>
        </div>

        {done && (
          <Card className="space-y-3">
            <p className="text-xs font-bold text-primary-strong">AI가 정리한 행사 조건</p>
            <Field label="행사명" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Field label="일시" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <Field label="배송지" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="인원(명)" type="number" value={String(form.headcount)} onChange={(v) => setForm({ ...form, headcount: Number(v) })} />
              <Field label="1인 예산(원)" type="number" value={String(form.budget)} onChange={(v) => setForm({ ...form, budget: Number(v) })} />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">식이 제한</p>
              <div className="flex flex-wrap gap-2">
                {ev.diet.map((d) => (
                  <span key={d} className="rounded-full bg-warning-soft px-3 py-1 text-xs font-semibold text-warning">{d}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-sm">
              <span className="text-muted-foreground">총 예산</span>
              <b className="tnum text-lg">{won(form.headcount * form.budget)}</b>
            </div>
            <p className="flex items-center gap-1 text-xs text-success"><Check className="size-3.5" /> 행사 48시간 전 사전예약 조건 충족 · 취합 마감 전날 18:00</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-primary" />
    </label>
  );
}
