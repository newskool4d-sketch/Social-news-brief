import type { CSSProperties } from "react";
import type { ArticleView, Face } from "@/lib/types";
import { faceLabel, faceAccent } from "@/lib/subject-labels";
import { StoryCard } from "./StoryCard";

function chunkPairs(articles: ArticleView[]): ArticleView[][] {
  const pairs: ArticleView[][] = [];
  for (let i = 0; i < articles.length; i += 2) {
    pairs.push(articles.slice(i, i + 2));
  }
  return pairs;
}

export function FaceSection({ face, isFirstFace }: { face: Face; isFirstFace: boolean }) {
  const lead = isFirstFace ? face.articles[0] : null;
  const rest = isFirstFace ? face.articles.slice(1) : face.articles;

  const accentStyle = { "--face-accent": faceAccent(face.subjectKey) } as CSSProperties;

  return (
    <section className="face">
      <div className="face-head" style={accentStyle}>
        <span className="face-label">{faceLabel(face.subjectKey)}</span>
        <span className="face-unit">
          {face.subjectKey} · {face.unitNames.join(" · ")}
        </span>
      </div>

      {lead ? <StoryCard article={lead} lead /> : null}

      {chunkPairs(rest).map((pair) =>
        pair.length === 2 ? (
          <div className="duo" key={pair[0].id}>
            {pair.map((article) => (
              <StoryCard article={article} key={article.id} />
            ))}
          </div>
        ) : (
          <StoryCard article={pair[0]} key={pair[0].id} />
        )
      )}
    </section>
  );
}
