"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * 상단 바 다크/라이트 수동 토글. 선택을 localStorage에 저장하고 <html data-theme>를 바꾼다.
 * 최초 페인트 전 깜빡임(FOUC)은 layout의 인라인 스크립트가 막고, 이 버튼은 이후 전환만 담당한다.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme | undefined)
      ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(current);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* localStorage 차단 환경은 조용히 무시 — 이번 세션만 적용 */
    }
    setTheme(next);
  }

  // 하이드레이션 불일치 방지: 테마 확정 전엔 라벨을 비워 둔다(버튼 크기는 유지).
  const label = theme === null ? "" : theme === "dark" ? "☀" : "☾";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "밝은 화면으로" : "어두운 화면으로"}
      title={theme === "dark" ? "밝은 화면으로" : "어두운 화면으로"}
    >
      {label}
    </button>
  );
}
