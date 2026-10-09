import { useSyncExternalStore } from "react";
import sotbap from "@/assets/food-sotbap.jpg";
import poke from "@/assets/food-poke.jpg";
import hanwoo from "@/assets/food-hanwoo.jpg";
import jeyuk from "@/assets/food-jeyuk.jpg";

export const won = (n: number) => n.toLocaleString("ko-KR") + "원";

export type Menu = { id: string; name: string; price: number; tag?: string; desc: string; img: string };
export type Candidate = {
  id: string;
  rank: number;
  name: string;
  category: string;
  img: string;
  perPerson: number;
  fit: number;
  reason: string;
  highlight: string;
  leadMin: number;
  minOrder: number;
  menus: Menu[];
};

export const candidates: Candidate[] = [
  {
    id: "damon",
    rank: 1,
    name: "정갈한 솥밥&도시락 담온",
    category: "모던 한식 · 프리미엄 영양솥밥 도시락",
    img: sotbap,
    perPerson: 14200,
    fit: 98.4,
    reason: "인근 직장인 리뷰 4.9점(120건+), 피크타임 '12시 정시 도착 보증' 체결 매장",
    highlight: "비건 솥밥 2개 완벽 분리 포장",
    leadMin: 35,
    minOrder: 120000,
    menus: [
      { id: "m1", name: "영양 버섯 솥밥 도시락", price: 13000, desc: "기본 찬 4종 포함", img: sotbap },
      { id: "m2", name: "매콤 제육 솥밥 도시락", price: 13500, tag: "매콤 보통맛", desc: "국내산 돼지 앞다리", img: jeyuk },
      { id: "m3", name: "비건 뿌리채소 정식", price: 13500, tag: "비건", desc: "알레르기 안전 레시피", img: poke },
      { id: "m4", name: "한우 불고기 솥밥", price: 15000, tag: "인기", desc: "1++ 한우 사용", img: hanwoo },
    ],
  },
  {
    id: "green",
    rank: 2,
    name: "보울 앤 그린 프리미엄",
    category: "샐러드 & 웜볼 · 커스텀 토핑",
    img: poke,
    perPerson: 13800,
    fit: 96.1,
    reason: "인당 식대 13,800원으로 최고 경제성, 식후 식곤증 방지 선호 설문 1위",
    highlight: "개인별 드레싱·토핑 100% 개별 커스텀",
    leadMin: 30,
    minOrder: 100000,
    menus: [
      { id: "g1", name: "아보카도 구운 템페 포케", price: 14000, tag: "비건", desc: "개별 라벨", img: poke },
      { id: "g2", name: "저염 닭가슴살 그린 보울", price: 12500, tag: "로우카브", desc: "드레싱 별도", img: poke },
      { id: "g3", name: "연어 포케 보울", price: 14500, desc: "생연어 120g", img: poke },
    ],
  },
  {
    id: "ondo",
    rank: 3,
    name: "온기 가득 한우 덮밥",
    category: "특상 한우 규동 · 든든한 보양식",
    img: hanwoo,
    perPerson: 15500,
    fit: 91.7,
    reason: "지난달 팀 만족도 1위 프랜차이즈, 비건 전용 버섯덮밥 대체 옵션 제공",
    highlight: "기업 첫 단체 주문 10% 쿠폰 자동 적용",
    leadMin: 40,
    minOrder: 150000,
    menus: [
      { id: "o1", name: "특상 한우 덮밥", price: 15500, desc: "수란 토핑", img: hanwoo },
      { id: "o2", name: "버섯 덮밥", price: 13000, tag: "비건", desc: "표고·새송이", img: sotbap },
    ],
  },
];

export type Response = { name: string; menuId: string | null; allergy?: string; host?: boolean };
export type Status = "draft" | "recommended" | "collecting" | "pending_approval" | "dispatched" | "confirmed" | "rejected";

export type EventState = {
  title: string;
  team: string;
  date: string;
  address: string;
  headcount: number;
  budget: number;
  diet: string[];
  status: Status;
  candidateId: string | null;
  members: string[];
  responses: Response[];
};

const initial: EventState = {
  title: "프로덕트팀 목요 런치",
  team: "디자인 혁신팀",
  date: "10월 15일(목) 12:00",
  address: "강남구 테헤란로 152 14층 회의실 A",
  headcount: 12,
  budget: 15000,
  diet: ["비건 2명", "갑각류 알레르기 1명"],
  status: "draft",
  candidateId: null,
  members: ["김서연", "이준호", "박민우", "정다은", "최유진", "한지훈", "오세라", "윤태경", "강하늘", "서지민", "문가영", "나(담당자)"],
  responses: [],
};

const KEY = "baemin-group-demo";
let state: EventState = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
}

export function setEvent(patch: Partial<EventState> | ((s: EventState) => Partial<EventState>)) {
  load();
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function resetDemo() {
  state = initial;
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}

export function useEvent() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      if (!loaded) {
        load();
        queueMicrotask(cb);
      }
      return () => listeners.delete(cb);
    },
    () => state,
    () => initial,
  );
}

export function selectedCandidate(s: EventState) {
  return candidates.find((c) => c.id === s.candidateId) ?? candidates[0]!;
}

/** Seeds simulated responses so the collect page has realistic progress. */
export function seedResponses(c: Candidate): Response[] {
  const m = c.menus;
  const pick = (i: number) => m[i % m.length]!.id;
  return [
    { name: "김서연", menuId: pick(0), host: true },
    { name: "이준호", menuId: m.find((x) => x.tag === "비건")?.id ?? pick(1), allergy: "비건" },
    { name: "최유진", menuId: pick(0) },
    { name: "한지훈", menuId: pick(1) },
    { name: "오세라", menuId: m.find((x) => x.tag === "비건")?.id ?? pick(2), allergy: "비건" },
    { name: "윤태경", menuId: pick(1), allergy: "갑각류" },
    { name: "강하늘", menuId: pick(0) },
    { name: "서지민", menuId: pick(3) },
    { name: "문가영", menuId: pick(0) },
  ];
}

export function tally(s: EventState) {
  const c = selectedCandidate(s);
  const rows = c.menus
    .map((menu) => {
      const qty = s.responses.filter((r) => r.menuId === menu.id).length;
      return { menu, qty, total: qty * menu.price };
    })
    .filter((r) => r.qty > 0);
  const total = rows.reduce((a, r) => a + r.total, 0);
  const responded = new Set(s.responses.map((r) => r.name));
  const missing = s.members.filter((n) => !responded.has(n));
  return { c, rows, total, missing, count: s.responses.length };
}
