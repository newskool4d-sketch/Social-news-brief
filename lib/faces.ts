import type { Article, ArticleView, Face, FlatStandard, Issue } from "./types";

/**
 * 면(단원) 배치 순서. 통합사회(공통)를 앞세우고 진로·융합선택을 뒤에 둔다.
 * 목록에 없는 과목이 나오면 뒤에 자동 추가한다.
 */
const FACE_ORDER = [
  "통합사회1",
  "통합사회2",
  "정치",
  "법과 사회",
  "경제",
  "금융과 경제생활",
  "국제관계의 이해",
  "사회와 문화",
  "사회문제 탐구",
];

/**
 * 기사의 대표 성취기준(첫 번째 코드)을 기준으로 면을 자동 배치한다.
 * 대표 성취기준이 정본에 없는 기사는 지면에서 제외한다(데이터 오류 방어).
 */
export function buildFaces(issue: Issue, flatStandards: Map<string, FlatStandard>): Face[] {
  const withPrimary: ArticleView[] = issue.articles
    .map((article) => {
      const primaryCode = article.standards[0]?.code;
      const primaryStandard = primaryCode ? flatStandards.get(primaryCode) ?? null : null;
      return { ...article, primaryStandard };
    })
    .filter((article): article is ArticleView & { primaryStandard: FlatStandard } => article.primaryStandard !== null);

  const bySubject = new Map<string, ArticleView[]>();
  for (const article of withPrimary) {
    const key = article.primaryStandard!.subjectKey;
    const list = bySubject.get(key) ?? [];
    list.push(article);
    bySubject.set(key, list);
  }

  const orderedKeys = [
    ...FACE_ORDER.filter((key) => bySubject.has(key)),
    ...[...bySubject.keys()].filter((key) => !FACE_ORDER.includes(key)),
  ];

  return orderedKeys.map((subjectKey) => {
    const articles = bySubject.get(subjectKey)!;
    const unitNames = [...new Set(articles.map((a) => a.primaryStandard!.unitName).filter(Boolean))];
    return {
      subjectKey,
      subjectType: articles[0].primaryStandard!.subjectType,
      unitNames,
      articles,
    };
  });
}

export function totalArticleCount(issue: Issue): number {
  return issue.articles.length;
}

export function collectIssueStandardCodes(issue: Issue): string[] {
  const codes = new Set<string>();
  for (const article of issue.articles) {
    for (const s of article.standards) codes.add(s.code);
  }
  return [...codes];
}

export type { Article };
