/**
 * 화면 표기용 과목(면) 정본 순서 — 2022 개정 사회과 정식 과목명 기준.
 * 통합사회1·통합사회2는 데이터상 성취기준이 다르지만, 과목명은 하나이므로
 * 화면에서는 "통합사회" 하나로 묶어 표기한다(toDisplaySubject 참조).
 * faces.ts·과목 메뉴·과목 아카이브·커버리지가 모두 이 표시 과목 기준으로 동작한다.
 */
export const FACE_ORDER = [
  "통합사회",
  "정치",
  "법과 사회",
  "경제",
  "금융과 경제생활",
  "국제관계의 이해",
  "사회와 문화",
  "사회문제 탐구",
] as const;

/**
 * 데이터상의 과목 key(통합사회1·통합사회2 등)를 화면 표시 과목으로 변환한다.
 * 통합사회1·2 → "통합사회". 그 외는 정식 과목명이라 그대로 쓴다.
 */
export function toDisplaySubject(subjectKey: string): string {
  if (subjectKey === "통합사회1" || subjectKey === "통합사회2") return "통합사회";
  return subjectKey;
}

/** 표시 과목 → 그것을 구성하는 데이터 과목 key 목록(커버리지 합산·아카이브 조회용). */
export function memberSubjectKeys(displaySubject: string): string[] {
  if (displaySubject === "통합사회") return ["통합사회1", "통합사회2"];
  return [displaySubject];
}
