import { Fragment } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/format";
import { nextPublishLabel } from "@/lib/schedule";

export function IssueNav({
  isoDate,
  dateLabel,
  prevDate,
  nextDate,
  faceCount,
  articleCount,
  standardCodes,
}: {
  isoDate: string;
  dateLabel: string;
  prevDate: string | null;
  nextDate: string | null;
  faceCount: number;
  articleCount: number;
  standardCodes: string[];
}) {
  return (
    <>
      <nav className="issue-nav" aria-label="지난 호 이동">
        {prevDate ? (
          <Link className="nav-btn" href={`/issues/${prevDate}`}>
            ◀ 지난 호 ({formatDateShort(prevDate)})
          </Link>
        ) : (
          <span className="nav-btn disabled">◀ 지난 호</span>
        )}
        <span className="issue-now">
          {dateLabel} — {faceCount}개 단원 · {articleCount}건
        </span>
        {nextDate ? (
          <Link className="nav-btn" href={`/issues/${nextDate}`}>
            다음 호 ▶
          </Link>
        ) : (
          // 최신 호: 다음 발행 예정일 안내 (평일 기준)
          <span className="nav-btn disabled">다음 호 {nextPublishLabel(isoDate)} 예정</span>
        )}
      </nav>
      {standardCodes.length > 0 ? (
        <p className="issue-std">
          오늘 실린 성취기준 —{" "}
          {standardCodes.map((code, i) => (
            <Fragment key={code}>
              {i > 0 ? " · " : ""}
              <b>{code}</b>
            </Fragment>
          ))}
        </p>
      ) : null}
    </>
  );
}
