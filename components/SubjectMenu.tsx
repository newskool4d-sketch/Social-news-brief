"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { faceLabel } from "@/lib/subject-labels";

export type SubjectMenuItem = { subjectKey: string; count: number };

/**
 * 상단 우측 "과목 ▾" 열기/닫기 메뉴. 클릭 시 과목별 아카이브(/subjects/[과목])로 이동.
 * ESC·바깥 클릭·항목 클릭으로 닫힌다.
 */
export function SubjectMenu({ subjects }: { subjects: SubjectMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="subjmenu" ref={wrapRef}>
      <button
        type="button"
        className="subjmenu-btn"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        과목 {open ? "▴" : "▾"}
      </button>
      {open ? (
        <div className="subjmenu-panel" role="menu">
          <Link href="/archive" className="subjmenu-item archive" role="menuitem" onClick={() => setOpen(false)}>
            📰 지난 호 전체
          </Link>
          <div className="subjmenu-sep" />
          {subjects.map(({ subjectKey, count }) => (
            <Link
              key={subjectKey}
              href={`/subjects/${encodeURIComponent(subjectKey)}`}
              className="subjmenu-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span>{faceLabel(subjectKey)}</span>
              <span className="subjmenu-count">{count}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
