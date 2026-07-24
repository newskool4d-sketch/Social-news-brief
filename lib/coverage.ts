import "server-only";
import { cache } from "react";
import { loadAllIssues } from "./data";
import { loadCurriculumRef } from "./curriculum";

export type SubjectCoverage = {
  subjectKey: string;
  type: string;
  totalStandards: number;
  coveredStandards: number; // 기사에 한 번이라도 태깅된 성취기준 수(대표+부 모두 집계)
  articleCount: number; // 대표 성취기준 기준 기사 수
};

/**
 * 과목별 성취기준 커버리지 — 122개 기준 중 몇 개가 기사로 커버됐는지.
 * 편집 나침반: 커버리지가 낮은 과목·단원을 다음 호에서 우선 노린다.
 */
export const computeCoverage = cache(async (): Promise<{
  subjects: SubjectCoverage[];
  totalStandards: number;
  totalCovered: number;
}> => {
  const [issues, ref] = await Promise.all([loadAllIssues(), loadCurriculumRef()]);

  // 코드 → 과목 매핑, 과목별 성취기준 수
  const codeToSubject = new Map<string, string>();
  for (const [subjectKey, subject] of Object.entries(ref.subjects)) {
    for (const s of subject.standards) codeToSubject.set(s.code, subjectKey);
  }

  // 태깅된(=커버된) 코드 집합 + 과목별 대표 기사 수
  const coveredCodes = new Set<string>();
  const articleCount: Record<string, number> = {};
  for (const issue of issues) {
    for (const article of issue.articles) {
      article.standards.forEach((s, i) => {
        coveredCodes.add(s.code);
        if (i === 0) {
          const subj = codeToSubject.get(s.code);
          if (subj) articleCount[subj] = (articleCount[subj] ?? 0) + 1;
        }
      });
    }
  }

  const subjects: SubjectCoverage[] = Object.entries(ref.subjects).map(([subjectKey, subject]) => {
    const covered = subject.standards.filter((s) => coveredCodes.has(s.code)).length;
    return {
      subjectKey,
      type: subject.type,
      totalStandards: subject.standards.length,
      coveredStandards: covered,
      articleCount: articleCount[subjectKey] ?? 0,
    };
  });

  const totalStandards = subjects.reduce((s, x) => s + x.totalStandards, 0);
  const totalCovered = subjects.reduce((s, x) => s + x.coveredStandards, 0);

  return { subjects, totalStandards, totalCovered };
});
