import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadAllIssues, loadIssue, loadIssueDates } from "@/lib/data";
import { loadFlatStandards } from "@/lib/curriculum";
import { buildFaces, collectIssueStandardCodes } from "@/lib/faces";
import { formatDateKorean } from "@/lib/format";
import { Masthead } from "@/components/Masthead";
import { IssueNav } from "@/components/IssueNav";
import { FaceSection } from "@/components/FaceSection";
import { Colophon } from "@/components/Colophon";
import { StandardDetailsProvider, type StandardDetail } from "@/components/StandardDetailsProvider";

export async function generateStaticParams() {
  const dates = await loadIssueDates();
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  return { title: `사회 브리핑 — ${formatDateKorean(date)}` };
}

export default async function IssuePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;

  const [issue, allIssues, flatStandards] = await Promise.all([
    loadIssue(date),
    loadAllIssues(),
    loadFlatStandards(),
  ]);

  if (!issue) notFound();

  const datesDesc = allIssues.map((i) => i.date);
  const datesAsc = [...datesDesc].sort();
  const issueNo = datesAsc.indexOf(date) + 1;
  const idx = datesDesc.indexOf(date);
  const nextDate = idx > 0 ? datesDesc[idx - 1] : null; // 더 최신 호
  const prevDate = idx < datesDesc.length - 1 ? datesDesc[idx + 1] : null; // 더 과거 호

  const faces = buildFaces(issue, flatStandards);

  const standardDetails: Record<string, StandardDetail> = {};
  for (const code of collectIssueStandardCodes(issue)) {
    const standard = flatStandards.get(code);
    if (standard) standardDetails[code] = { text: standard.text, explain: standard.explain };
  }

  return (
    <StandardDetailsProvider details={standardDetails}>
      <div className="sheet">
        <Masthead issueNo={issueNo} dateLabel={formatDateKorean(date)} />
        <IssueNav
          dateLabel={formatDateKorean(date)}
          prevDate={prevDate}
          nextDate={nextDate}
          faceCount={faces.length}
          articleCount={issue.articles.length}
          standardCodes={collectIssueStandardCodes(issue)}
        />
        <main>
          {faces.length === 0 ? (
            <p className="issue-empty">이 호에는 성취기준에 해당하는 기사가 없습니다.</p>
          ) : (
            faces.map((face, i) => <FaceSection face={face} isFirstFace={i === 0} key={face.subjectKey} />)
          )}
        </main>
        <Colophon />
      </div>
    </StandardDetailsProvider>
  );
}
