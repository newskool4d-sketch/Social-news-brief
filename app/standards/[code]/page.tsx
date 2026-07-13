import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadFlatStandards } from "@/lib/curriculum";
import { findArticlesByStandard } from "@/lib/standard-archive";
import { formatDateKorean, formatDateShort } from "@/lib/format";
import { faceLabel } from "@/lib/subject-labels";

export async function generateStaticParams() {
  const flat = await loadFlatStandards();
  return [...flat.keys()].map((code) => ({ code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const code = decodeURIComponent((await params).code);
  return { title: `${code} 관련 기사 — 사회 브리핑` };
}

export default async function StandardPage({ params }: { params: Promise<{ code: string }> }) {
  const code = decodeURIComponent((await params).code);
  const flat = await loadFlatStandards();
  const standard = flat.get(code);
  if (!standard) notFound();

  const archived = await findArticlesByStandard(code);

  return (
    <div className="sheet">
      <header className="masthead">
        <div className="mast-row">
          <div className="mast-side left">성취기준 모아보기</div>
          <h1 className="mast-title" style={{ fontSize: "clamp(28px, 4.5vw, 40px)" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              사회 브리핑
            </Link>
          </h1>
          <div className="mast-side right">
            {standard.subjectKey} ({standard.subjectType})
            <br />
            {standard.unitName}
          </div>
        </div>
        <div className="rule-double" />
      </header>

      <section className="face">
        <div className="face-head">
          <span className="face-label">{faceLabel(standard.subjectKey)}</span>
          <span className="face-unit">
            {standard.subjectKey} · {standard.unitName}
          </span>
        </div>

        <div className="std-detail" style={{ display: "block", marginTop: 0 }}>
          <div className="code">{standard.code}</div>
          <div>{standard.text}</div>
          {standard.explain ? <div style={{ marginTop: 11, color: "var(--muted)" }}>{standard.explain}</div> : null}
        </div>

        <h2 style={{ fontSize: 19, marginTop: 34 }}>이 성취기준으로 읽은 기사 {archived.length}건</h2>
        {archived.length === 0 ? (
          <p className="issue-empty">아직 이 성취기준으로 태깅된 기사가 없습니다.</p>
        ) : (
          archived.map(({ issueDate, article }) => (
            <article className="story" key={article.id} style={{ marginTop: 22 }}>
              <div className="story-meta">
                <span className={`scope${article.scope === "국내" ? " dom" : ""}`}>{article.scope}</span>
                {article.reported ? (
                  <time className="report-date" dateTime={article.reported}>
                    {formatDateShort(article.reported)} 보도
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
          성취기준 배지를 눌러 이 화면에 왔다면,{" "}
          <Link href="/" style={{ color: "inherit" }}>
            최신 호로 돌아가기
          </Link>
        </p>
      </footer>
    </div>
  );
}
