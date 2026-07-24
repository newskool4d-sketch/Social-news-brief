import "server-only";
import { cache } from "react";
import { loadAllIssues } from "./data";
import { loadFlatStandards } from "./curriculum";
import type { Article } from "./types";

export type SubjectArchivedArticle = {
  issueDate: string;
  article: Article;
};

/**
 * 과목(curriculum_ref.json의 key)으로 태깅된 역대 기사를 최신순으로 돌려준다.
 * 기사의 대표 성취기준(standards[0])이 해당 과목이면 그 과목의 기사로 본다 — 면 배치와 동일 기준.
 */
export const findArticlesBySubject = cache(async (subjectKey: string): Promise<SubjectArchivedArticle[]> => {
  const [issues, flat] = await Promise.all([loadAllIssues(), loadFlatStandards()]);
  const hits: SubjectArchivedArticle[] = [];
  for (const issue of issues) {
    for (const article of issue.articles) {
      const primaryCode = article.standards[0]?.code;
      const primary = primaryCode ? flat.get(primaryCode) : undefined;
      if (primary?.subjectKey === subjectKey) {
        hits.push({ issueDate: issue.date, article });
      }
    }
  }
  return hits;
});

/** 전 과목의 기사 수 집계 (메뉴에 건수 배지 표시용). key = 과목명, value = 대표 성취기준 기준 기사 수. */
export const countArticlesBySubject = cache(async (): Promise<Record<string, number>> => {
  const [issues, flat] = await Promise.all([loadAllIssues(), loadFlatStandards()]);
  const counts: Record<string, number> = {};
  for (const issue of issues) {
    for (const article of issue.articles) {
      const primaryCode = article.standards[0]?.code;
      const primary = primaryCode ? flat.get(primaryCode) : undefined;
      if (primary) counts[primary.subjectKey] = (counts[primary.subjectKey] ?? 0) + 1;
    }
  }
  return counts;
});
