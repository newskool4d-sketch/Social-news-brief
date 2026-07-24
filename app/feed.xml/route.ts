import { loadAllIssues } from "@/lib/data";

export const dynamic = "force-static";

const SITE = "https://social-news-brief.vercel.app";

function esc(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

/** RSS 2.0 피드 — 호 단위(교사 구독용). 최신 호가 위로. */
export async function GET() {
  const issues = await loadAllIssues();
  const items = issues
    .map((issue) => {
      const headlines = issue.articles.map((a) => `• ${a.title}`).join("\n");
      const pubDate = new Date(`${issue.date}T09:00:00+09:00`).toUTCString();
      return `    <item>
      <title>${esc(`${issue.date} 호 (${issue.articles.length}건)`)}</title>
      <link>${SITE}/issues/${issue.date}</link>
      <guid isPermaLink="true">${SITE}/issues/${issue.date}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(headlines)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>학생을 위한 사회 뉴스 브리핑</title>
    <link>${SITE}</link>
    <description>2022 개정 교육과정 성취기준으로 읽는 오늘의 뉴스. 매주 금요일 발행.</description>
    <language>ko</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
