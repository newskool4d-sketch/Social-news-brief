import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "수업 활용 안내 — 학생을 위한 사회 뉴스 브리핑",
  description: "통합사회·일반사회 수업에서 이 아카이브를 쓰는 방법.",
};

export default function GuidePage() {
  return (
    <div className="sheet">
      <header className="masthead">
        <div className="mast-row">
          <div className="mast-side left">교사용</div>
          <h1 className="mast-title" style={{ fontSize: "clamp(26px, 4.2vw, 40px)" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              수업 활용 안내
            </Link>
          </h1>
          <div className="mast-side right">
            통합사회·일반사회
            <br />
            2022 개정 교육과정
          </div>
        </div>
        <div className="rule-double" />
      </header>

      <main className="guide">
        <section className="guide-sec">
          <h2>무엇인가요</h2>
          <p>
            매주 금요일, 2022 개정 교육과정 성취기준에 연계되는 &lsquo;생각을 여는&rsquo; 시사 기사만 골라 신문
            형식으로 싣는 아카이브입니다. 각 기사에는 <b>재서술 요약</b>, <b>생각해 보기</b> 질문, <b>연계
            성취기준</b>, 원문 링크가 함께 담깁니다.
          </p>
        </section>

        <section className="guide-sec">
          <h2>수업에서 이렇게 쓰세요</h2>
          <ol className="guide-flow">
            <li>
              <b>도입 — 기사 읽기</b>: 그 주 단원에 맞는 면(과목)의 기사를 골라 함께 읽습니다. 상단 우측 <b>과목
              메뉴</b>에서 과목별로 지난 기사를 모아 볼 수 있습니다.
            </li>
            <li>
              <b>전개 — 생각해 보기 토론</b>: 기사 아래 <b>생각해 보기</b> 질문으로 4인 모둠 토론을 엽니다. 질문은
              정답이 없는 가치 판단·트레이드오프형이라, 근거를 들어 입장을 세우는 활동에 적합합니다.
            </li>
            <li>
              <b>정리 — 성취기준으로 개념화</b>: 기사의 <b>성취기준 배지</b>를 누르면 성취기준 전문과 해설이 펼쳐집니다.
              토론 내용을 성취기준의 개념·용어로 정리하면 자연스럽게 교육과정과 연결됩니다.
            </li>
            <li>
              <b>확장 — 인쇄 배포</b>: 브라우저 인쇄 기능으로 그 호를 A4로 출력해 학습지로 나눠 줄 수 있습니다(화면
              전용 요소는 인쇄 시 자동으로 빠집니다).
            </li>
          </ol>
        </section>

        <section className="guide-sec">
          <h2>찾아보기</h2>
          <ul className="guide-links">
            <li>
              <Link href="/archive">지난 호 전체</Link> — 발행된 모든 호를 날짜·헤드라인으로 훑어봅니다.
            </li>
            <li>
              <Link href="/coverage">성취기준 커버리지</Link> — 어느 과목·단원이 아직 덜 다뤄졌는지 한눈에.
            </li>
            <li>상단 <b>과목 ▾</b> 메뉴 — 과목별 기사 모아보기.</li>
          </ul>
        </section>

        <section className="guide-sec">
          <h2>편집 원칙</h2>
          <p>
            본문은 원문 기사를 <b>재서술</b>한 것으로, 사실 확인은 각 기사의 원문 링크에서 하실 수 있습니다. 특정
            진영을 편들지 않도록 논쟁 사안은 양쪽 논리를 함께 담거나 제도·구조의 관점으로 서술합니다. 자살·범죄
            상세 묘사 등 교실에 부적절한 소재는 배제합니다.
          </p>
        </section>
      </main>

      <footer className="colophon">
        <p>
          <Link href="/" style={{ color: "inherit" }}>
            최신 호로 돌아가기
          </Link>
        </p>
      </footer>
    </div>
  );
}
