import type { Metadata } from "next";
import Link from "next/link";
import { computeCoverage } from "@/lib/coverage";
import { FACE_ORDER } from "@/lib/subjects";
import { faceLabel, faceAccent } from "@/lib/subject-labels";

export const metadata: Metadata = {
  title: "성취기준 커버리지 — 학생을 위한 사회 뉴스 브리핑",
  description: "9과목 성취기준 중 몇 개가 기사로 다뤄졌는지 과목별 진행 현황.",
};

export default async function CoveragePage() {
  const { subjects, totalStandards, totalCovered } = await computeCoverage();
  const order = new Map(FACE_ORDER.map((k, i) => [k as string, i]));
  const sorted = [...subjects].sort(
    (a, b) => (order.get(a.subjectKey) ?? 99) - (order.get(b.subjectKey) ?? 99)
  );
  const pct = totalStandards ? Math.round((totalCovered / totalStandards) * 100) : 0;

  return (
    <div className="sheet">
      <header className="masthead">
        <div className="mast-row">
          <div className="mast-side left">편집 나침반</div>
          <h1 className="mast-title" style={{ fontSize: "clamp(26px, 4.2vw, 40px)" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              성취기준 커버리지
            </Link>
          </h1>
          <div className="mast-side right">
            전체 {totalCovered}/{totalStandards}
            <br />
            {pct}% 다룸
          </div>
        </div>
        <div className="rule-double" />
      </header>

      <main>
        <p className="coverage-intro">
          2022 개정 통합사회·일반사회 <b>{totalStandards}개</b> 성취기준 중 지금까지 기사로 다룬 것은{" "}
          <b>{totalCovered}개</b>입니다. 커버리지가 낮은 과목이 다음 호에서 우선 살펴볼 영역입니다.
        </p>

        {sorted.map((s) => {
          const p = s.totalStandards ? Math.round((s.coveredStandards / s.totalStandards) * 100) : 0;
          return (
            <div className="coverage-row" key={s.subjectKey}>
              <div className="coverage-label">
                <Link href={`/subjects/${encodeURIComponent(s.subjectKey)}`}>{faceLabel(s.subjectKey)}</Link>
                <span className="coverage-type">{s.type}</span>
              </div>
              <div className="coverage-bar" role="img" aria-label={`${p}% 커버`}>
                <div
                  className="coverage-fill"
                  style={{ width: `${p}%`, background: faceAccent(s.subjectKey) }}
                />
              </div>
              <div className="coverage-num">
                {s.coveredStandards}/{s.totalStandards}
                <span className="coverage-art"> · 기사 {s.articleCount}건</span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="colophon">
        <p>
          커버리지는 &lsquo;기사에 한 번이라도 태깅된 성취기준 수 ÷ 과목 전체 성취기준 수&rsquo;입니다. 과목명을
          누르면 그 과목 기사 모아보기로 이동합니다.
        </p>
        <p>
          <Link href="/" style={{ color: "inherit" }}>
            최신 호로 돌아가기
          </Link>
        </p>
      </footer>
    </div>
  );
}
