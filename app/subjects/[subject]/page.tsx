import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCurriculumRef } from "@/lib/curriculum";
import { findArticlesBySubject } from "@/lib/subject-archive";
import { formatDateKorean, formatDateFull } from "@/lib/format";
import { faceLabel } from "@/lib/subject-labels";

export async function generateStaticParams() {
  const ref = await loadCurriculumRef();
  return Object.keys(ref.subjects).map((subject) => ({ subject }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const subject = decodeURIComponent((await params).subject);
  return { title: `${subject} 기사 모아보기 — 학생을 위한 사회 뉴스 브리핑` };
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const subject = decodeURIComponent((await params).subject);
  const ref = await loadCurriculumRef();
  const meta = ref.subjects[subject];
  if (!meta) notFound();

  const archived = await findArticlesBySubject(subject);

  return (
    <div className="sheet">
      <header className="masthead">
        <div className="mast-row">
          <div className="mast-side left">과목별 모아보기</div>
          <h1 className="mast-title" style={{ fontSize: "clamp(28px, 4.5vw, 42px)" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              {faceLabel(subject)}
            </Link>
          </h1>
          <div className="mast-side right">
            {subject}
            <br />
            {meta.type}
          </div>
        </div>
        <div className="rule-double" />
      </header>

      <section className="face">
        <div className="face-head">
          <span className="face-label">{faceLabel(subject)}</span>
          <span className="face-unit">이 과목으로 읽은 기사 {archived.length}건</span>
        </div>

        {archived.length === 0 ? (
          <p className="issue-empty">아직 이 과목으로 실린 기사가 없습니다.</p>
        ) : (
          archived.map(({ issueDate, article }) => (
            <article className="story" key={article.id} style={{ marginTop: 22 }}>
              <div className="story-meta">
                <span className={`scope${article.scope === "국내" ? " dom" : ""}`}>{article.scope}</span>
                {article.reported ? (
                  <time className="report-date" dateTime={article.reported}>
                    {formatDateFull(article.reported)} 보도
                  </time>
                ) : null}
                <Link href={`/issues/${issueDate}`} style={{ color: "var(--muted)" }}>
                  {formatDateKorean(issueDate)} 호
                </Link>
              </div>
              <h2 style={{ fontSize: 21 }}>
                <Link href={`/issues/${issueDate}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {article.title}
                </Link>
              </h2>
              <p className="lede">{article.lede}</p>
              {article.think ? (
                <aside className="think">
                  <div className="think-label">생각해 보기</div>
                  <p>{article.think}</p>
                </aside>
              ) : null}
            </article>
          ))
        )}
      </section>

      <footer className="colophon">
        <p>
          <Link href="/" style={{ color: "inherit" }}>
            최신 호로 돌아가기
          </Link>{" "}
          ·{" "}
          <Link href="/archive" style={{ color: "inherit" }}>
            지난 호 전체 보기
          </Link>
        </p>
      </footer>
    </div>
  );
}
