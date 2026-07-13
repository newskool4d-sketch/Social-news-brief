import { Fragment } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/format";
import { PUBLISH_DAYS_LABEL } from "@/lib/schedule";

export function IssueNav({
  dateLabel,
  prevDate,
  nextDate,
  faceCount,
  articleCount,
  standardCodes,
}: {
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
          // 최신 호: 다음 발행 안내 (주간 발행이라 특정 날짜 대신 주기를 표시 — 공휴일 이월 대응)
          <span className="nav-btn disabled">다음 호 예정 · {PUBLISH_DAYS_LABEL}</span>
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
