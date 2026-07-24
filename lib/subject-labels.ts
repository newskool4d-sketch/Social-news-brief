import { toDisplaySubject } from "./subjects";

/**
 * 면 머리·메뉴·아카이브에 쓰는 과목 라벨 = 2022 개정 사회과 정식 과목명.
 * 데이터 key(통합사회1·2 등)를 표시 과목으로 바꾼 값이 곧 정식 과목명이다.
 * (과거의 "경제·금융"·"국제관계"·"사회·문화" 같은 축약은 폐기 — 정식명 사용)
 */
export function faceLabel(subjectKey: string): string {
  return toDisplaySubject(subjectKey);
}

/**
 * 면(과목) 식별용 미묘한 액센트 색. 신문 톤을 해치지 않도록 채도를 낮춘 잉크 계열.
 * 표시 과목(통합사회1·2는 "통합사회") 기준으로 색을 정한다.
 */
const FACE_ACCENTS: Record<string, string> = {
  통합사회: "#7a8c5a", // 올리브
  정치: "#9c6b4a", // 벽돌
  "법과 사회": "#5f7a8c", // 청회
  경제: "#a3833a", // 황토
  "금융과 경제생활": "#a3833a",
  "국제관계의 이해": "#6a6f9c", // 남보라
  "사회와 문화": "#8c5f7a", // 자주
  "사회문제 탐구": "#5f8c7a", // 청록
};

export function faceAccent(subjectKey: string): string {
  return FACE_ACCENTS[toDisplaySubject(subjectKey)] ?? "var(--muted)";
}
