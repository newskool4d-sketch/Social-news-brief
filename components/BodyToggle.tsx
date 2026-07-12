"use client";

import { useState } from "react";
import type { ArticleBody } from "@/lib/types";

export function BodyToggle({ sections }: { sections: ArticleBody[] }) {
  const [open, setOpen] = useState(false);

  if (sections.length === 0) return null;

  return (
    <div>
      <button
        className="deep-toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "접기 ⌃" : "본문 자세히 ⌄"}
      </button>
      {open ? (
        <div className="deep">
          {sections.map((section) => (
            <div className="sec" key={section.h}>
              <div className="sec-h">{section.h}</div>
              <p className="sec-p">{section.p}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
