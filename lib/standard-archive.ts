import "server-only";
import { cache } from "react";
import { loadAllIssues } from "./data";
import type { Article } from "./types";

export type ArchivedArticle = {
  issueDate: string;
  article: Article;
};

/** 특정 성취기준 코드로 태깅된 역대 기사를 최신순으로 돌려준다. */
export const findArticlesByStandard = cache(async (code: string): Promise<ArchivedArticle[]> => {
  const issues = await loadAllIssues();
  const hits: ArchivedArticle[] = [];
  for (const issue of issues) {
    for (const article of issue.articles) {
      if (article.standards.some((s) => s.code === code)) {
        hits.push({ issueDate: issue.date, article });
      }
    }
  }
  return hits;
});
