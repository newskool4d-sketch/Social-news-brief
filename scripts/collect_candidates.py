# -*- coding: utf-8 -*-
"""Google News RSS 기반 1차 후보 수집기 (daily-news-picker 스킬 검색 방식 이식, 2026-07-14).

WebSearch 반복 호출 대신 RSS로 날짜 정확한(after:/before:) 후보군을 결정론적으로 뽑고,
content/source_whitelist.json 도메인만 남긴 뒤 원문 URL을 복원해 JSON으로 저장한다.
선별(생각을 유발하는 기사인가)·태깅·재서술·사실 검증(WebFetch)은 이 스크립트가 하지 않는다
— 사회브리핑 스킬(에이전트)이 이 JSON을 후보 롱리스트로 삼아 그 위에서 판단한다.

이 스크립트가 실패하거나 이 환경에 Python/네트워크가 없으면 스킬은 기존 WebSearch 방식으로
폴백한다 — 이 스크립트는 파이프라인의 유일한 경로가 아니다.

사용:
    python scripts/collect_candidates.py                      # since=마지막 발행 다음날, until=오늘
    python scripts/collect_candidates.py --since 2026-07-08 --until 2026-07-14
    python scripts/collect_candidates.py --out content/.collect/candidates.json

출처: 검색 메커니즘(RSS 수집·after:/before: PT 변환·batchexecute 원문 URL 복원)은
~/.codex/skills/daily-news-picker/scripts/collect_news_rss.py(2026-07-17 실측 검증)에서 이식.
"""
import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
KST = timezone(timedelta(hours=9))
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

# 사회 브리핑 5개 축의 시딩 검색어. 넓은 원시 후보군을 얻는 출발점일 뿐이며,
# 이 목록에 없는 시의성 있는 사안은 스킬이 WebSearch로 별도 보강한다.
AXIS_QUERIES = {
    "정치·행정": ["국회 법안", "정부 정책 발표"],
    "법·사법": ["대법원 판결", "헌법재판소 결정"],
    "경제·금융": ["한국은행 기준금리", "통계청 발표"],
    "사회·문화": ["사회 갈등", "저출산 고령화"],
    "국제관계": ["국제 분쟁", "외교 협상"],
}


def load_whitelist_domains():
    with open(os.path.join(ROOT, "content", "source_whitelist.json"), encoding="utf-8") as f:
        return set(json.load(f)["allowed"])


def domain_matches(hostname: str, allowed: set) -> str | None:
    for d in allowed:
        if hostname == d or hostname.endswith("." + d):
            return d
    return None


def title_key(title: str) -> str:
    return re.sub(r"[^0-9A-Za-z가-힣]", "", title).lower()


def strip_source_suffix(title: str, source_name: str) -> str:
    suffix = f" - {source_name}"
    return title[: -len(suffix)].strip() if source_name and title.endswith(suffix) else title.strip()


def gnews_range_operator(start: datetime, end: datetime) -> str:
    """Google News가 after:/before:를 미국 태평양시(PT) 기준으로 해석하므로 변환한다.
    경계 오차(±1일)는 이후 KST 기준 in_window() 정밀 필터가 흡수한다."""
    pt = timezone(timedelta(hours=-7))
    after = start.astimezone(pt).date()
    before = end.astimezone(pt).date() + timedelta(days=1)
    return f"after:{after:%Y-%m-%d} before:{before:%Y-%m-%d}"


def fetch_rss(query: str, when: str):
    q = urllib.parse.quote(f"{query} {when}")
    url = f"https://news.google.com/rss/search?q={q}&hl=ko&gl=KR&ceid=KR:ko"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        root = ET.fromstring(resp.read())
    items = []
    for item in root.iter("item"):
        source = item.find("source")
        items.append({
            "title": item.findtext("title") or "",
            "link": item.findtext("link") or "",
            "pubdate": item.findtext("pubDate") or "",
            "source_name": source.text if source is not None else "",
            "source_url": source.get("url") if source is not None else "",
        })
    return items


def resolve_original_url(google_link: str):
    """news.google.com 리다이렉트 → 언론사 원문 URL (batchexecute 내부 API)."""
    m = re.search(r"/articles/([^?]+)", google_link)
    if not m:
        return None
    article_id = m.group(1)
    req = urllib.request.Request(google_link, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        body = resp.read().decode("utf-8", errors="replace")
    sig = re.search(r'data-n-a-sg="([^"]+)"', body)
    ts = re.search(r'data-n-a-ts="([^"]+)"', body)
    if not (sig and ts):
        return None
    payload_inner = json.dumps([
        "garturlreq",
        [["X", "X", ["X", "X"], None, None, 1, 1, "KR:ko", None, 1, None, None, None, None, None, 0, 1],
         "X", "X", 1, [1, 1, 1], 1, 1, None, 0, 0, None, 0],
        article_id, ts.group(1), sig.group(1),
    ])
    f_req = json.dumps([[["Fbv4je", payload_inner, None, "generic"]]])
    data = urllib.parse.urlencode({"f.req": f_req}).encode("utf-8")
    req = urllib.request.Request(
        "https://news.google.com/_/DotsSplashUi/data/batchexecute",
        data=data,
        headers={**HEADERS, "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        text = resp.read().decode("utf-8", errors="replace")
    for line in text.splitlines():
        if '"Fbv4je"' not in line:
            continue
        try:
            outer = json.loads(line)
        except json.JSONDecodeError:
            continue
        for entry in outer:
            if isinstance(entry, list) and len(entry) > 2 and entry[0] == "wrb.fr":
                inner = json.loads(entry[2])
                found = []

                def walk(node):
                    if isinstance(node, str) and node.startswith("http") and "google.com" not in node:
                        found.append(node)
                    elif isinstance(node, list):
                        for x in node:
                            walk(x)

                walk(inner)
                if found:
                    return found[0]
    return None


def default_since() -> str:
    """가장 최근 발행 파일 다음 날. 파일이 없으면 7일 전."""
    data_dir = os.path.join(ROOT, "content", "data")
    dates = sorted(f[:-5] for f in os.listdir(data_dir) if f.endswith(".json"))
    if not dates:
        return (datetime.now(KST) - timedelta(days=7)).strftime("%Y-%m-%d")
    last = datetime.strptime(dates[-1], "%Y-%m-%d")
    return (last + timedelta(days=1)).strftime("%Y-%m-%d")


def main():
    parser = argparse.ArgumentParser(description="사회 브리핑 RSS 후보 수집기")
    parser.add_argument("--since", default=None, help="YYYY-MM-DD (기본: 마지막 발행 다음날)")
    parser.add_argument("--until", default=datetime.now(KST).strftime("%Y-%m-%d"), help="YYYY-MM-DD (기본: 오늘)")
    parser.add_argument("--out", default=None)
    args = parser.parse_args()

    since = args.since or default_since()
    until = args.until
    start = datetime.strptime(since, "%Y-%m-%d").replace(tzinfo=KST)
    end = datetime.strptime(until, "%Y-%m-%d").replace(tzinfo=KST) + timedelta(days=1)
    when = gnews_range_operator(start, end)

    allowed = load_whitelist_domains()
    seen_titles = set()
    candidates = []
    errors = []

    for axis, queries in AXIS_QUERIES.items():
        for q in queries:
            try:
                items = fetch_rss(q, when)
            except Exception as e:
                errors.append({"axis": axis, "query": q, "error": f"{type(e).__name__}: {e}"})
                print(f"[수집 실패] {axis} / {q}: {type(e).__name__}: {e}", file=sys.stderr)
                continue

            for it in items:
                host = urllib.parse.urlsplit(it["source_url"] or "").hostname or ""
                matched_domain = domain_matches(host, allowed)
                if not matched_domain:
                    continue  # 화이트리스트 외 매체는 후보에서 제외

                try:
                    pub_kst = parsedate_to_datetime(it["pubdate"]).astimezone(KST)
                except Exception:
                    continue
                if not (start <= pub_kst < end):
                    continue  # PT 변환 경계 오차를 KST 정밀 필터로 흡수

                title = strip_source_suffix(it["title"], it["source_name"])
                key = title_key(title)
                if key in seen_titles:
                    continue
                seen_titles.add(key)

                candidates.append({
                    "axis": axis,
                    "query": q,
                    "title": title,
                    "source_name": it["source_name"],
                    "domain": matched_domain,
                    "reported": pub_kst.strftime("%Y-%m-%d"),
                    "google_link": it["link"],
                    "url": None,  # 아래에서 화이트리스트 매치분만 복원
                })

    print(f"화이트리스트 매체 후보 {len(candidates)}건 — 원문 URL 복원 중...", file=sys.stderr)
    for c in candidates:
        try:
            c["url"] = resolve_original_url(c["google_link"])
        except Exception as e:
            errors.append({"axis": c["axis"], "query": c["query"], "error": f"resolve 실패({c['title'][:30]}): {e}"})

    out_path = args.out or os.path.join(ROOT, "content", ".collect", f"candidates-{until}.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({
            "since": since, "until": until,
            "candidate_count": len(candidates),
            "candidates": candidates,
            "errors": errors,
        }, f, ensure_ascii=False, indent=2)

    print(f"완료: 후보 {len(candidates)}건, 오류 {len(errors)}건 → {out_path}")
    if errors:
        print("※ 오류가 있었던 축/검색어는 위 stderr 참조 — 조용히 누락시키지 말고 수동 WebSearch로 보강할 것.")


if __name__ == "__main__":
    main()
