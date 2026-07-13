/**
 * 발행 일정의 단일 정본. 요일·문구가 바뀌면 이 파일만 수정한다.
 * (제호·호수 내비게이션·판권이 모두 여기를 참조)
 */
export const PUBLISH_DAYS_LABEL = "매주 월~금 발행 · 주말 휴간";

export const PUBLISH_POLICY_LABEL =
  "평일 오전에 기사를 수집·검증하고 편집자 승인을 거쳐 게재합니다. 성취기준에 연계할 기사가 없는 날은 결호입니다.";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 주어진 호 날짜(YYYY-MM-DD) 다음의 발행 예정일(평일)을 "M. D.(요일)" 형태로 돌려준다. */
export function nextPublishLabel(fromDate: string): string {
  const [y, m, d] = fromDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() === 0 || date.getDay() === 6);
  return `${date.getMonth() + 1}. ${date.getDate()}.(${WEEKDAY_LABELS[date.getDay()]})`;
}
