import { useSyncExternalStore } from "react";

export type Provider = "kakao" | "naver" | "phone";
export type DemoUser = { name: string; title: string; team: string; provider: Provider; card: string };

const KEY = "baemin-demo-user";
let user: DemoUser | null = null;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { user = JSON.parse(localStorage.getItem(KEY) || "null"); } catch { user = null; }
}

export function useUser() {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => subs.delete(cb); },
    () => { load(); return user; },
    () => null,
  );
}

function set(u: DemoUser | null) {
  user = u;
  if (u) localStorage.setItem(KEY, JSON.stringify(u)); else localStorage.removeItem(KEY);
  subs.forEach((f) => f());
}

export function signIn(provider: Provider) {
  set({ name: "김배민", title: "대리", team: "우아한형제들 마케팅팀", provider, card: "법인카드 신한 **** 1234" });
}
export function signOut() { set(null); }
