import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 학생을 위한 사회 뉴스 브리핑",
  description: "이 사이트가 수집하는 정보와 처리 방침 안내.",
};

export default function PrivacyPage() {
  return (
    <div className="sheet">
      <header className="masthead">
        <div className="mast-row">
          <div className="mast-side left">이용 안내</div>
          <h1 className="mast-title" style={{ fontSize: "clamp(26px, 4.2vw, 40px)" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              개인정보처리방침
            </Link>
          </h1>
          <div className="mast-side right">
            시행일
            <br />
            2026. 7. 31.
          </div>
        </div>
        <div className="rule-double" />
      </header>

      <main className="guide">
        <section className="guide-sec">
          <h2>한눈에</h2>
          <p>
            이 사이트는 <b>회원가입·로그인·문의 양식이 없으며, 이용자로부터 개인정보를 직접 수집하지
            않습니다.</b> 방문자 수를 파악하기 위한 익명 통계만 이용합니다.
          </p>
        </section>

        <section className="guide-sec">
          <h2>수집하지 않는 것</h2>
          <ul className="guide-links">
            <li>이름·연락처·이메일·학교 등 신원을 알 수 있는 정보</li>
            <li>회원 계정 및 로그인 기록</li>
            <li>게시글·댓글 등 이용자가 작성한 내용</li>
            <li>광고·마케팅 목적의 추적 쿠키</li>
          </ul>
        </section>

        <section className="guide-sec">
          <h2>이용하는 통계 도구</h2>
          <p>
            방문 규모를 파악하기 위해 이 사이트를 호스팅하는 <b>Vercel</b>의 웹 분석(Web Analytics)
            기능을 사용합니다. 이 기능은 <b>쿠키를 사용하지 않고</b> 방문자를 식별하지 않는 익명 집계
            방식으로, 페이지 조회 수·유입 경로·기기 종류 같은 통계 정보만 처리합니다. 개별 이용자를
            특정하거나 다른 정보와 결합하지 않으며, 사이트 운영자는 집계된 수치만 열람합니다.
          </p>
        </section>

        <section className="guide-sec">
          <h2>외부 링크</h2>
          <p>
            각 기사의 &lsquo;원문 보기&rsquo; 링크는 해당 언론사 사이트로 연결됩니다. 링크를 따라 이동한
            뒤에는 그 사이트의 개인정보처리방침이 적용되며, 이 사이트는 외부 사이트의 정보 처리에 관여하지
            않습니다.
          </p>
        </section>

        <section className="guide-sec">
          <h2>문의</h2>
          <p>
            방침에 관한 문의는 이 사이트의 소스 저장소(GitHub)의 이슈로 남겨 주시기 바랍니다. 방침이
            변경되면 이 페이지에 시행일과 함께 게시합니다.
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
