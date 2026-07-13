"use client";

import { useState } from "react";
import Link from "next/link";
import type { StandardRef } from "@/lib/types";
import { useStandardDetail } from "./StandardDetailsProvider";

function Badge({ standard, open, onToggle }: { standard: StandardRef; open: boolean; onToggle: () => void }) {
  return (
    <button className="std" type="button" aria-expanded={open} onClick={onToggle}>
      <b>{standard.code}</b>
      {standard.gloss}
    </button>
  );
}

function Detail({ code }: { code: string }) {
  const detail = useStandardDetail(code);
  if (!detail) return null;
  return (
    <div className="std-detail" role="region" aria-label="성취기준 전문">
      <div className="code">{code}</div>
      <div>{detail.text}</div>
      {detail.explain ? (
        <div style={{ marginTop: 11, color: "var(--muted)" }}>{detail.explain}</div>
      ) : null}
      <div style={{ marginTop: 11 }}>
        <Link href={`/standards/${encodeURIComponent(code)}`} className="src-link" style={{ marginLeft: 0 }}>
          이 성취기준의 기사 모아보기 →
        </Link>
      </div>
    </div>
  );
}

export function StandardBadges({ standards }: { standards: StandardRef[] }) {
  const [openCode, setOpenCode] = useState<string | null>(null);

  if (standards.length === 0) return null;

  return (
    <div>
      <div className="std-row">
        {standards.map((standard) => (
          <Badge
            key={standard.code}
            standard={standard}
            open={openCode === standard.code}
            onToggle={() => setOpenCode((prev) => (prev === standard.code ? null : standard.code))}
          />
        ))}
      </div>
      {openCode ? <Detail code={openCode} /> : null}
    </div>
  );
}
