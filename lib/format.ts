export function formatDateKorean(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}. ${Number(m)}. ${Number(d)}.`;
}

export function formatDateShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}. ${Number(d)}.`;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** "2026. 7. 8.(수)" — 연도 + 요일 포함. 로컬 시간 기준으로 요일 계산(UTC 파싱 시프트 방지). */
export function formatDateFull(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  return `${y}. ${m}. ${d}.(${weekday})`;
}
