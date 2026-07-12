import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { CurriculumRef, FlatStandard } from "./types";

const CURRICULUM_PATH = path.join(process.cwd(), "content", "curriculum_ref.json");

/**
 * 성취기준 코드에서 영역(단원) 키를 추출한다.
 * 통합사회1·2는 "10통사1-01-01" 처럼 대시 2개(영역이 가운데),
 * 그 외 선택과목은 "12사문01-01" 처럼 대시 1개(영역이 과목코드 뒤 2자리)로 표기된다.
 */
function extractUnitKey(code: string): string {
  const parts = code.split("-");
  if (parts.length === 3) return parts[1];
  return parts[0].slice(-2);
}

export const loadCurriculumRef = cache(async (): Promise<CurriculumRef> => {
  const raw = await readFile(CURRICULUM_PATH, "utf-8");
  return JSON.parse(raw) as CurriculumRef;
});

export const loadFlatStandards = cache(async (): Promise<Map<string, FlatStandard>> => {
  const ref = await loadCurriculumRef();
  const flat = new Map<string, FlatStandard>();

  for (const [subjectKey, subject] of Object.entries(ref.subjects)) {
    for (const standard of subject.standards) {
      const unitKey = extractUnitKey(standard.code);
      flat.set(standard.code, {
        code: standard.code,
        subjectKey,
        subjectType: subject.type,
        unitKey,
        unitName: subject.units[unitKey] ?? "",
        text: standard.text,
        explain: standard.explain,
      });
    }
  }

  return flat;
});
