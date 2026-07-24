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

/**
 * 면(과목) 식별용 미묘한 액센트 색. 신문 톤을 해치지 않도록 채도를 낮춘 잉크 계열.
 * 면 머리 좌측의 얇은 색 바에만 쓴다(라이트·다크 공통으로 무난한 중간 채도).
 */
const FACE_ACCENTS: Record<string, string> = {
  통합사회1: "#7a8c5a", // 올리브(자연·환경)
  통합사회2: "#7a8c5a",
  정치: "#9c6b4a", // 벽돌(권력·제도)
  "법과 사회": "#5f7a8c", // 청회(법·질서)
  경제: "#a3833a", // 황토(시장·화폐)
  "금융과 경제생활": "#a3833a",
  "국제관계의 이해": "#6a6f9c", // 남보라(국제)
  "사회와 문화": "#8c5f7a", // 자주(문화)
  "사회문제 탐구": "#5f8c7a", // 청록(탐구)
};

export function faceAccent(subjectKey: string): string {
  return FACE_ACCENTS[subjectKey] ?? "var(--muted)";
}
