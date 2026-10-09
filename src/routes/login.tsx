import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, X } from "lucide-react";

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

function Login() {
  const btn = "flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-bold";
  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-card px-6 py-5">
        <Link to="/" aria-label="닫기"><X className="size-7" /></Link>
        <div className="flex flex-1 flex-col items-center justify-center">
          <h1 className="text-5xl font-black tracking-tight">배달의민족</h1>
          <p className="mt-3 rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-accent-foreground">단체주문 AI 비서</p>
        </div>
        <div className="space-y-3">
          <Link to="/" className={`${btn} bg-kakao text-kakao-foreground`}><MessageCircle className="size-5 fill-current" /> 카카오로 계속하기</Link>
          <Link to="/" className={`${btn} bg-naver text-primary-foreground`}><b>N</b> 네이버로 계속하기</Link>
          <Link to="/" className={`${btn} border border-border`}><Phone className="size-5" /> 휴대폰번호로 계속하기</Link>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">이용약관 | 개인정보처리방침 | 사업자정보확인</p>
      </div>
    </div>
  );
}
