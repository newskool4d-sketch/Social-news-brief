import { redirect } from "next/navigation";
import { loadAllIssues } from "@/lib/data";

export default async function HomePage() {
  const issues = await loadAllIssues();

  if (issues.length === 0) {
    return (
      <div className="sheet">
        <p className="issue-empty">아직 발행된 호가 없습니다. content/data/에 첫 호 JSON을 추가해 주세요.</p>
      </div>
    );
  }

  redirect(`/issues/${issues[0].date}`);
}
