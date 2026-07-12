#!/usr/bin/env node
/**
 * 호(issue) 데이터 검증기.
 *
 *   node scripts/validate-issue.mjs content/data/2026-07-12.json
 *
 * 스키마·성취기준 코드 유효성·기사 수 상한 등 기계적으로 판정 가능한 규칙을 전부 검사한다.
 * 빌더(lib/faces.ts)는 무효 코드 기사를 조용히 지면에서 제외하므로, 발행 전 반드시 이
 * 검증기를 통과시켜 "기사가 사라지는" 사고를 막는다. 종료 코드: 0=통과, 1=실패.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAX_ARTICLES = 5;
const MAX_STANDARDS = 3;

const errors = [];
const warnings = [];

const target = process.argv[2];
if (!target) {
  console.error("사용법: node scripts/validate-issue.mjs content/data/YYYY-MM-DD.json");
  process.exit(1);
}

let issue;
try {
  issue = JSON.parse(readFileSync(path.resolve(target), "utf-8"));
} catch (e) {
  console.error(`JSON 파싱 실패: ${e.message}`);
  process.exit(1);
}

const ref = JSON.parse(readFileSync(path.join(ROOT, "content", "curriculum_ref.json"), "utf-8"));
const validCodes = new Set();
for (const subject of Object.values(ref.subjects)) {
  for (const s of subject.standards) validCodes.add(s.code);
}

// ── 호 수준 검사 ──
if (!/^\d{4}-\d{2}-\d{2}$/.test(issue.date ?? "")) {
  errors.push(`date가 YYYY-MM-DD 형식이 아님: ${issue.date}`);
}
const fileDate = path.basename(target, ".json");
if (issue.date && issue.date !== fileDate) {
  errors.push(`파일명(${fileDate})과 date(${issue.date}) 불일치`);
}
if (!Array.isArray(issue.articles) || issue.articles.length === 0) {
  errors.push("articles가 비어 있음 — 실을 기사가 없으면 파일을 만들지 말 것(결호)");
}
if (Array.isArray(issue.articles) && issue.articles.length > MAX_ARTICLES) {
  errors.push(`기사 ${issue.articles.length}건 — 상한 ${MAX_ARTICLES}건 초과(선별 기준 재검토)`);
}

// ── 기사 수준 검사 ──
const seenIds = new Set();
for (const [i, a] of (issue.articles ?? []).entries()) {
  const tag = `기사[${i}] ${a.id ?? "(id 없음)"}`;

  if (!a.id || !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(a.id)) {
    errors.push(`${tag}: id는 "YYYY-MM-DD-소문자-슬러그" 형식이어야 함`);
  }
  if (seenIds.has(a.id)) errors.push(`${tag}: id 중복`);
  seenIds.add(a.id);

  if (a.scope !== "국내" && a.scope !== "해외") {
    errors.push(`${tag}: scope는 "국내" 또는 "해외"여야 함 (현재: ${a.scope})`);
  }
  if (!a.title?.trim()) errors.push(`${tag}: title 누락`);
  if (!a.lede?.trim()) errors.push(`${tag}: lede 누락`);
  if (!a.think?.trim()) warnings.push(`${tag}: think(생각해 보기) 없음 — 선별 취지상 반드시 재고`);

  if (!Array.isArray(a.standards) || a.standards.length === 0) {
    errors.push(`${tag}: standards 없음 — 성취기준 미연계 기사는 실을 수 없음`);
  } else {
    if (a.standards.length > MAX_STANDARDS) {
      errors.push(`${tag}: 성취기준 ${a.standards.length}개 — 상한 ${MAX_STANDARDS}개(억지 매핑 재검토)`);
    }
    for (const s of a.standards) {
      if (!validCodes.has(s.code)) {
        errors.push(`${tag}: 무효 성취기준 코드 "${s.code}" — curriculum_ref.json에 없음(지면에서 자동 제외됨)`);
      }
      if (!s.gloss?.trim()) errors.push(`${tag}: ${s.code}의 gloss 누락`);
    }
  }

  if (!Array.isArray(a.tags) || a.tags.length === 0) warnings.push(`${tag}: tags 없음`);

  if (!a.source?.name?.trim() || !/^https?:\/\//.test(a.source?.url ?? "")) {
    errors.push(`${tag}: source.name 또는 source.url(http/https) 누락`);
  } else if (/example\.com/.test(a.source.url)) {
    errors.push(`${tag}: source.url이 example.com 플레이스홀더 — 실제 기사 URL로 교체할 것`);
  }

  if (a.body !== undefined) {
    if (!Array.isArray(a.body) || a.body.some((sec) => !sec.h?.trim() || !sec.p?.trim())) {
      errors.push(`${tag}: body는 [{h, p}] 배열이어야 하며 빈 항목 불가`);
    }
  }
}

// ── 결과 ──
for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n검증 실패: 오류 ${errors.length}건, 경고 ${warnings.length}건`);
  process.exit(1);
}
console.log(`검증 통과: 기사 ${issue.articles.length}건, 경고 ${warnings.length}건 (${issue.date})`);
