import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Loader2, LogOut, MessageCircle, Pencil, Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Card } from "@/components/AppShell";
import { signIn, signOut, updateUser, useUser, type Provider } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "로그인 — 배민 단체주문 AI" },
      { name: "description", content: "카카오·네이버로 간편하게 로그인하고 단체주문을 시작하세요." },
      { property: "og:title", content: "배민 단체주문 로그인" },
      { property: "og:description", content: "간편 로그인으로 시작하세요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

const label: Record<Provider, string> = { kakao: "카카오", naver: "네이버", phone: "휴대폰번호" };
const history = [
  { date: "10.02", title: "3분기 마케팅팀 워크숍 점심", count: 12, amount: "186,000원" },
  { date: "09.18", title: "신규 입사자 환영 저녁", count: 8, amount: "142,000원" },
  { date: "09.05", title: "주간 회의 도시락", count: 10, amount: "115,000원" },
];

function Login() {
  const user = useUser();
  const [loading, setLoading] = useState<Provider | null>(null);
  const [editing, setEditing] = useState(false);

  const go = (p: Provider) => {
    setLoading(p);
    setTimeout(() => {
      signIn(p);
      setLoading(null);
      toast.success(`${label[p]} 계정으로 인증되었습니다`);
    }, 600);
  };

  if (user) {
    return (
      <AppShell>
        <div className="space-y-4 p-5">
          <Card>
            {editing ? (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const name = String(f.get("name")).trim();
                  if (!name) { toast.error("이름을 입력해 주세요"); return; }
                  updateUser({ name, title: String(f.get("title")).trim(), team: String(f.get("team")).trim() });
                  setEditing(false);
                  toast.success("프로필이 저장되었습니다");
                }}
              >
                {([["name", "이름", user.name], ["title", "직급", user.title], ["team", "소속", user.team]] as const).map(([k, l, v]) => (
                  <label key={k} className="block text-sm font-semibold">
                    {l}
                    <input name={k} defaultValue={v} maxLength={40} className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 font-normal outline-none focus:border-primary" />
                  </label>
                ))}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setEditing(false)} className="h-11 flex-1 rounded-xl border border-border font-semibold">취소</button>
                  <button type="submit" className="h-11 flex-1 rounded-xl bg-primary font-bold text-primary-foreground">저장</button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-lg font-black text-primary-foreground">{user.name[0]}</div>
                <div className="flex-1">
                  <p className="text-lg font-bold">{user.name} {user.title}</p>
                  <p className="text-sm text-muted-foreground">{user.team}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label[user.provider]} 간편로그인</p>
                </div>
                <button onClick={() => setEditing(true)} aria-label="프로필 수정" className="grid size-10 place-items-center rounded-full bg-secondary"><Pencil className="size-4" /></button>
              </div>
            )}
          </Card>
          <Card>
            <p className="flex items-center gap-2 font-bold"><CreditCard className="size-5 text-primary-strong" /> 등록된 결제수단</p>
            <p className="mt-2 text-sm text-muted-foreground">{user.card}</p>
          </Card>
          <Card>
            <p className="font-bold">최근 단체주문</p>
            <ul className="mt-3 divide-y divide-border">
              {history.map((h) => (
                <li key={h.title} className="flex items-center justify-between py-3 text-sm">
                  <div><p className="font-semibold">{h.title}</p><p className="text-muted-foreground">{h.date} · {h.count}명</p></div>
                  <span className="font-bold">{h.amount}</span>
                </li>
              ))}
            </ul>
          </Card>
          <button onClick={() => { signOut(); toast("로그아웃되었습니다"); }} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card font-semibold text-muted-foreground">
            <LogOut className="size-4" /> 로그아웃
          </button>
        </div>
      </AppShell>
    );
  }

  const btn = "flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-bold disabled:opacity-60";
  const icon = (p: Provider, el: import("react").ReactNode) => (loading === p ? <Loader2 className="size-5 animate-spin" /> : el);
  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-card px-6 py-5">
        <Link to="/" aria-label="닫기"><X className="size-7" /></Link>
        <div className="flex flex-1 flex-col items-center justify-center">
          <h1 className="text-5xl font-black tracking-tight">배달의민족</h1>
          <p className="mt-3 rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-accent-foreground">단체주문 AI 비서</p>
        </div>
        <div className="space-y-3">
          <button disabled={!!loading} onClick={() => go("kakao")} className={`${btn} bg-kakao text-kakao-foreground`}>{icon("kakao", <MessageCircle className="size-5 fill-current" />)} 카카오로 계속하기</button>
          <button disabled={!!loading} onClick={() => go("naver")} className={`${btn} bg-naver text-primary-foreground`}>{icon("naver", <b>N</b>)} 네이버로 계속하기</button>
          <button disabled={!!loading} onClick={() => go("phone")} className={`${btn} border border-border`}>{icon("phone", <Phone className="size-5" />)} 휴대폰번호로 계속하기</button>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">이용약관 | 개인정보처리방침 | 사업자정보확인</p>
      </div>
    </div>
  );
}
