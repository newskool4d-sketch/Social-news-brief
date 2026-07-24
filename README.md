# 학생을 위한 사회 뉴스 브리핑 (Social News Brief)

2022 개정 교육과정 성취기준(통합사회1·2, 일반사회 영역 일반선택·진로선택·융합선택 7과목)으로
오늘의 뉴스를 읽는 종이 신문 형식 아카이브. Next.js(App Router) + Vercel.

## 구조

```
content/
  curriculum_ref.json   # 성취기준 정본 — 9과목 122건, 교육부 고시 제2022-33호 [별책 7] 대조 완료
  data/
    YYYY-MM-DD.json      # 호(issue)별 기사 데이터. 하루 1파일.
lib/
  types.ts               # 데이터 타입
  curriculum.ts           # curriculum_ref.json 로드 + 성취기준 코드 플랫화
  data.ts                 # content/data/*.json 로드
  faces.ts                # 기사의 대표 성취기준으로 면(단원) 자동 배치
  format.ts, subject-labels.ts
components/               # Masthead, IssueNav, FaceSection, StoryCard, StandardBadges, BodyToggle, Colophon
app/
  page.tsx                # 최신 호로 리다이렉트
  issues/[date]/page.tsx  # 호별 페이지 (generateStaticParams로 전 호 정적 생성)
```

## 데이터 스키마 (`content/data/YYYY-MM-DD.json`)

```jsonc
{
  "date": "2026-07-12",
  "articles": [
    {
      "id": "고유-id",
      "scope": "국내" | "해외",
      "reported": "2026-07-09",                    // 원문 보도일(발행일 이전). 기사 카드에 "M. D. 보도"로 표시
      "title": "헤드라인",
      "subhead": "부제(선택)",
      "lede": "리드 문단",
      "body": [{ "h": "소제목", "p": "본문" }],   // 선택 — 있으면 "본문 자세히" 토글 노출
      "think": "생각해 보기 문항",
      "standards": [{ "code": "10통사1-02-01", "gloss": "짧은 요지" }],
      "tags": ["해시태그"],
      "source": { "name": "매체명", "url": "https://..." }
    }
  ]
}
```

- **면(단원) 배치**: `standards[0]`(대표 성취기준)의 과목으로 자동 결정됩니다. 별도 분류 필드가 없습니다.
- **`reported`(원문 보도일)**: 발행일(`date`)과 다를 수 있습니다 — 수집 기간이 주말·공휴일을 포함하므로. 발행일보다 미래일 수 없습니다(검증기가 차단).
- **출처(`source.url`)**: `content/source_whitelist.json` 목록 매체만, 포털(daum·naver·nate) 리다이렉트가 아닌 원매체 URL.
- **결호**: 그날 성취기준에 해당하는 기사가 없으면 파일을 만들지 않으면 됩니다(하루 0~6건 — 생각을 유발하는 기사만 선별).
- **성취기준 코드**: `content/curriculum_ref.json`에 있는 코드만 유효합니다. 없는 코드를 쓴 기사는 지면에서 자동 제외됩니다(방어적 처리).

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 (타입 체크 포함)
```

## 기사 수집 (RSS 1차 + WebSearch 보강)

```bash
python scripts/collect_candidates.py    # since=마지막 발행 다음날, until=오늘 (기본값)
```

Google News RSS를 `after:/before:` 날짜 연산자로 조회해 `content/source_whitelist.json` 도메인만
남기고 원문 URL을 복원한 뒤 `content/.collect/candidates-YYYY-MM-DD.json`(git 미추적 임시 캐시)에
저장합니다. 사회브리핑 스킬이 이 후보 롱리스트 위에서 선별·태깅·검증을 수행합니다. 세부는
`~/.claude/skills/사회브리핑/SKILL.md`의 "검색 방식" 참조.

## 발행 전 검증 (필수)

```bash
node scripts/validate-issue.mjs content/data/YYYY-MM-DD.json
```

스키마·성취기준 코드 실존 여부·기사 수 상한(9건)·원문 보도일·출처 화이트리스트·placeholder URL 등을 검사합니다.
빌더는 무효 코드 기사를 조용히 지면에서 제외하므로, push 전 반드시 통과시켜야 합니다.

## 배포

GitHub에 push하면 Vercel이 자동으로 빌드·배포합니다(최초 1회 Vercel 대시보드에서 "Import Git Repository"로 이 리포를 연결).

## 시드 데이터 안내

`content/data/2026-07-12.json`은 **디자인·빌드 검증용 예시 데이터**입니다. `source.url`이 전부
`example.com` 플레이스홀더이며 실제 보도가 아닙니다. 실 데이터 파이프라인(수집 스킬) 연결 시
이 파일을 교체하거나 삭제하세요.
