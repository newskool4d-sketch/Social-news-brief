import "server-only";
import { cache } from "react";
import { loadAllIssues } from "./data";
import { loadFlatStandards } from "./curriculum";
import { toDisplaySubject } from "./subjects";
import type { Article } from "./types";

export type SubjectArchivedArticle = {
  issueDate: string;
  article: Article;
};

/**
 * 표시 과목으로 태깅된 역대 기사를 최신순으로 돌려준다(통합사회 = 통합사회1·2 합침).
 * 기사의 대표 성취기준(standards[0])이 속한 과목을 표시 과목으로 환산해 비교한다 — 면 배치와 동일 기준.
 */
export const findArticlesBySubject = cache(async (displaySubject: string): Promise<SubjectArchivedArticle[]> => {
  const [issues, flat] = await Promise.all([loadAllIssues(), loadFlatStandards()]);
  const hits: SubjectArchivedArticle[] = [];
  for (const issue of issues) {
    for (const article of issue.articles) {
      const primaryCode = article.standards[0]?.code;
      const primary = primaryCode ? flat.get(primaryCode) : undefined;
      if (primary && toDisplaySubject(primary.subjectKey) === displaySubject) {
        hits.push({ issueDate: issue.date, article });
      }
    }
  }
  return hits;
});

/** 표시 과목별 기사 수 집계(메뉴 건수 배지용). key = 표시 과목명, value = 대표 성취기준 기준 기사 수. */
export const countArticlesBySubject = cache(async (): Promise<Record<string, number>> => {
  const [issues, flat] = await Promise.all([loadAllIssues(), loadFlatStandards()]);
  const counts: Record<string, number> = {};
  for (const issue of issues) {
    for (const article of issue.articles) {
      const primaryCode = article.standards[0]?.code;
      const primary = primaryCode ? flat.get(primaryCode) : undefined;
      if (primary) {
        const key = toDisplaySubject(primary.subjectKey);
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }
  }
  return counts;
});
