import Link from "next/link";

export function Masthead({ issueNo, dateLabel }: { issueNo: number; dateLabel: string }) {
  return (
    <header className="masthead">
      <div className="mast-row">
        <div className="mast-side left">
          제{issueNo}호
          <br />
          성취기준 연계 시사 아카이브
        </div>
        <h1 className="mast-title">
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            사회 브리핑
          </Link>
        </h1>
        <div className="mast-side right">
          {dateLabel}
          <br />
          통합사회 · 일반사회 영역
        </div>
      </div>
      <p className="mast-sub">2022 개정 교육과정 성취기준으로 읽는 오늘의 뉴스 — 생각을 여는 기사만 싣습니다</p>
      <div className="rule-double" />
    </header>
  );
}
