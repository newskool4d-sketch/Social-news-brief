import Link from "next/link";
import { countArticlesBySubject } from "@/lib/subject-archive";
import { FACE_ORDER } from "@/lib/subjects";
import { SubjectMenu, type SubjectMenuItem } from "./SubjectMenu";
import { ThemeToggle } from "./ThemeToggle";

/**
 * 전 페이지 공통 상단 바(sticky). 좌측 제호 축약 링크, 우측 과목 메뉴.
 * 서버에서 과목별 기사 수를 집계해 클라이언트 메뉴에 주입한다.
 */
export async function TopBar() {
  const counts = await countArticlesBySubject();
  const ordered = [
    ...FACE_ORDER.filter((k) => k in counts),
    ...Object.keys(counts).filter((k) => !(FACE_ORDER as readonly string[]).includes(k)),
  ];
  const subjects: SubjectMenuItem[] = ordered.map((subjectKey) => ({ subjectKey, count: counts[subjectKey] }));

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="topbar-brand">
          학생을 위한 사회 뉴스 브리핑
        </Link>
        <div className="topbar-actions">
          <ThemeToggle />
          <SubjectMenu subjects={subjects} />
        </div>
      </div>
    </div>
  );
}
