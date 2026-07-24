import type { Metadata } from "next";
import Link from "next/link";
import { loadAllIssues } from "@/lib/data";
import { loadFlatStandards } from "@/lib/curriculum";
import { formatDateFull } from "@/lib/format";

export const metadata: Metadata = {
  title: "지난 호 전체 — 학생을 위한 사회 뉴스 브리핑",
  description: "발행된 모든 호의 목록. 호별 날짜·기사 수·헤드라인을 한눈에.",
};

export default async function ArchivePage() {
  const [issues, flat] = await Promise.all([loadAllIssues(), loadFlatStandards()]);
  const totalIssues = issues.length;
  const totalArticles = issues.reduce((s, i) => s + i.articles.length, 0);

  return (
    <div className="sheet">
      <header className="masthead">
        <div className="mast-row">
          <div className="mast-side left">지난 호 전체</div>
          <h1 className="mast-title" style={{ fontSize: "clamp(28px, 4.5vw, 42px)" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              발행 아카이브
            </Link>
          </h1>
          <div className="mast-side right">
            총 {totalIssues}개 호
            <br />
            기사 {totalArticles}건
          </div>
        </div>
        <div className="rule-double" />
      </header>

      <main>
        {issues.map((issue, idx) => {
          const issueNo = totalIssues - idx; // 최신이 가장 높은 호수
          const subjects = new Set<string>();
          for (const a of issue.articles) {
            const primary = a.standards[0]?.code ? flat.get(a.standards[0].code) : undefined;
            if (primary) subjects.add(primary.subjectKey);
          }
          return (
            <section className="archive-issue" key={issue.date}>
              <Link href={`/issues/${issue.date}`} className="archive-issue-head">
                <span className="archive-no">제{issueNo}호</span>
                <span className="archive-date">{formatDateFull(issue.date)}</span>
                <span className="archive-meta">
                  {subjects.size}개 단원 · {issue.articles.length}건
                </span>
              </Link>
              <ul className="archive-list">
                {issue.articles.map((a) => (
                  <li key={a.id}>
                    <Link href={`/issues/${issue.date}#${a.id}`}>
                      <span className={`scope${a.scope === "국내" ? " dom" : ""}`}>{a.scope}</span> {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>

      <footer className="colophon">
        <p>
          <Link href="/" style={{ color: "inherit" }}>
            최신 호로 돌아가기
          </Link>
        </p>
      </footer>
    </div>
  );
}
