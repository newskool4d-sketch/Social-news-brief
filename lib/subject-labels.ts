/**
 * 면 머리에 쓰는 짧은 과목 라벨. 정본 과목명(curriculum_ref.json의 key)을
 * 신문 지면 표기로 축약한다. 목록에 없으면 정본 과목명을 그대로 쓴다.
 */
const FACE_LABELS: Record<string, string> = {
  통합사회1: "통합사회",
  통합사회2: "통합사회",
  정치: "정치",
  "법과 사회": "법과 사회",
  경제: "경제",
  "금융과 경제생활": "경제·금융",
  "국제관계의 이해": "국제관계",
  "사회와 문화": "사회·문화",
  "사회문제 탐구": "사회문제 탐구",
};

export function faceLabel(subjectKey: string): string {
  return FACE_LABELS[subjectKey] ?? subjectKey;
}
