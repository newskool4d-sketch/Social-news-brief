import path from "node:path";
import type { NextConfig } from "next";

/**
 * Content-Security-Policy
 * - 'unsafe-inline'(script): 다크모드 깜빡임 방지 인라인 스크립트(app/layout.tsx)에 필요.
 *   nonce 방식은 정적 생성(SSG) 페이지와 함께 쓰기 어려워 이 사이트에서는 채택하지 않는다.
 * - va.vercel-scripts.com: Vercel Web Analytics 스크립트(개발 모드 디버그 번들 포함).
 * - 'unsafe-inline'(style): next/font가 주입하는 인라인 스타일에 필요.
 * - img/font data:: 인라인 SVG·폰트 데이터 URI 허용.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
