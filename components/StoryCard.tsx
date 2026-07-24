import type { ArticleView } from "@/lib/types";
import { formatDateFull } from "@/lib/format";
import { StandardBadges } from "./StandardBadges";
import { BodyToggle } from "./BodyToggle";

export function StoryCard({ article, lead = false }: { article: ArticleView; lead?: boolean }) {
  return (
    <article className={`story${lead ? " lead" : ""}`} id={article.id}>
      <div className="story-meta">
        <span className={`scope${article.scope === "국내" ? " dom" : ""}`}>{article.scope}</span>
        {article.reported ? (
          <time className="report-date" dateTime={article.reported}>
            {formatDateFull(article.reported)} 보도
          </time>
        ) : null}
      </div>
      <h2>{article.title}</h2>
      {article.subhead ? <p className="subhead">{article.subhead}</p> : null}
      <p className={`lede${lead ? " two-col" : ""}`}>{article.lede}</p>
      {article.body && article.body.length > 0 ? <BodyToggle sections={article.body} /> : null}
      <a className="src-cta" href={article.source.url} target="_blank" rel="noopener noreferrer">
        {article.source.name}에서 기사 본문을 확인할 수 있습니다 →
      </a>
      {article.think ? (
        <aside className="think">
          <div className="think-label">생각해 보기</div>
          <p>{article.think}</p>
        </aside>
      ) : null}
      <StandardBadges standards={article.standards} />
      <div className="story-foot">
        <div className="tags">
          {article.tags.map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
