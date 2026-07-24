import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCurriculumRef, loadFlatStandards } from "@/lib/curriculum";
import { findArticlesBySubject } from "@/lib/subject-archive";
import { formatDateKorean } from "@/lib/format";
import { faceLabel } from "@/lib/subject-labels";
import { toDisplaySubject, memberSubjectKeys } from "@/lib/subjects";
import { StoryCard } from "@/components/StoryCard";
import { Colophon } from "@/components/Colophon";
import { StandardDetailsProvider, type StandardDetail } from "@/components/StandardDetailsProvider";
import type { ArticleView } from "@/lib/types";

export async function generateStaticParams() {
  const ref = await loadCurriculumRef();
  const displaySubjects = [...new Set(Object.keys(ref.subjects).map(toDisplaySubject))];
  return displaySubjects.map((subject) => ({ subject }));
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
  const [ref, flat, archived] = await Promise.all([
    loadCurriculumRef(),
    loadFlatStandards(),
    findArticlesBySubject(subject),
  ]);

  const members = memberSubjectKeys(subject);
  const meta = members.map((k) => ref.subjects[k]).find(Boolean);
  if (!meta) notFound();

  // 초기 화면과 동일한 StoryCard를 쓰기 위해 대표 성취기준을 붙이고, 배지 펼침용 전문을 모은다.
  const standardDetails: Record<string, StandardDetail> = {};
  const items = archived.map(({ issueDate, article }) => {
    for (const s of article.standards) {
      const std = flat.get(s.code);
      if (std) standardDetails[s.code] = { text: std.text, explain: std.explain };
    }
    const primaryCode = article.standards[0]?.code;
    const view: ArticleView = { ...article, primaryStandard: primaryCode ? flat.get(primaryCode) ?? null : null };
    return { issueDate, view };
  });

  return (
    <StandardDetailsProvider details={standardDetails}>
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
            <span className="face-unit">이 과목으로 읽은 기사 {items.length}건</span>
          </div>

          {items.length === 0 ? (
            <p className="issue-empty">아직 이 과목으로 실린 기사가 없습니다.</p>
          ) : (
            items.map(({ issueDate, view }) => (
              <div className="subject-item" key={view.id}>
                <Link href={`/issues/${issueDate}`} className="subject-item-issue">
                  {formatDateKorean(issueDate)} 호에서 →
                </Link>
                <StoryCard article={view} />
              </div>
            ))
          )}
        </section>

        <Colophon />
      </div>
    </StandardDetailsProvider>
  );
}
