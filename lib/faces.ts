import type { Article, ArticleView, Face, FlatStandard, Issue } from "./types";
import { FACE_ORDER, toDisplaySubject } from "./subjects";

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

  // 표시 과목 기준으로 묶는다 — 통합사회1·2는 하나의 "통합사회" 면으로 합쳐진다.
  const bySubject = new Map<string, ArticleView[]>();
  for (const article of withPrimary) {
    const key = toDisplaySubject(article.primaryStandard!.subjectKey);
    const list = bySubject.get(key) ?? [];
    list.push(article);
    bySubject.set(key, list);
  }

  const faceOrder = FACE_ORDER as readonly string[];
  const orderedKeys = [
    ...faceOrder.filter((key) => bySubject.has(key)),
    ...[...bySubject.keys()].filter((key) => !faceOrder.includes(key)),
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
