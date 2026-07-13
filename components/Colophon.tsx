import { PUBLISH_DAYS_LABEL, PUBLISH_POLICY_LABEL } from "@/lib/schedule";

export function Colophon() {
  return (
    <footer className="colophon">
      <p>
        발행 일정 — {PUBLISH_DAYS_LABEL}. {PUBLISH_POLICY_LABEL}
      </p>
      <p>
        편집 원칙 — 성취기준에 연계되는 &lsquo;생각을 여는&rsquo; 기사만 한 주 최대 8건, 가능한 한 과목별로 고르게
        선별합니다. 단원(면) 배치는 기사의 대표 성취기준에서 자동 결정되며, 국내·해외 기사를 함께 다룹니다.
        본문은 원문 기사를 재서술한 것으로, 사실 확인은 각 기사의 원문 링크에서 할 수 있습니다.
      </p>
    </footer>
  );
}
