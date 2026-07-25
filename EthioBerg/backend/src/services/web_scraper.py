from __future__ import annotations

import hashlib
import re
import time
from dataclasses import dataclass
from datetime import date
from html.parser import HTMLParser
from typing import Any, Callable
from urllib.parse import urlparse

import httpx

SKIP_TAGS = {"script", "style", "noscript", "aside", "nav", "footer", "header"}
TEXT_TAGS = {"p", "li", "td", "th", "blockquote", "pre", "span", "div", "a", "strong", "em", "b", "i", "section", "h1"}


def clean_text(value: str) -> str:
    if not value:
        return ""
    value = value.encode("utf-8", errors="ignore").decode("utf-8")
    return re.sub(r"\s+", " ", value).strip()


@dataclass
class ExtractedPage:
    title: str
    body: str


class _HTMLTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self.h1 = ""
        self.article_parts: list[str] = []
        self.paragraph_parts: list[str] = []
        self._skip_depth = 0
        self._article_depth = 0
        self._in_title = False
        self._in_h1 = False
        self._current_container: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in SKIP_TAGS:
            self._skip_depth += 1
            return
        if tag in {"article", "main"}:
            self._article_depth += 1
        if tag == "title":
            self._in_title = True
        elif tag == "h1":
            self._in_h1 = True
        if tag in TEXT_TAGS:
            self._current_container = tag

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in SKIP_TAGS and self._skip_depth:
            self._skip_depth -= 1
        if tag in {"article", "main"} and self._article_depth:
            self._article_depth -= 1
        if tag == "title":
            self._in_title = False
        elif tag == "h1":
            self._in_h1 = False
        if tag == self._current_container:
            self._current_container = None

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        text = data.strip()
        if not text:
            return
        if self._in_title and not self.title:
            self.title = text
        elif self._in_h1 and not self.h1:
            self.h1 = text
        elif self._current_container:
            if self._article_depth > 0:
                self.article_parts.append(text)
            elif self._current_container in {"p", "li", "h1"}:
                self.paragraph_parts.append(text)

    def result(self) -> ExtractedPage:
        body = clean_text(" ".join(self.article_parts))
        if not body:
            body = clean_text(" ".join(self.paragraph_parts))
        title = self.title or self.h1
        return ExtractedPage(title=title, body=body)


def extract_from_html(raw_html: str) -> ExtractedPage:
    parser = _HTMLTextExtractor()
    try:
        parser.feed(raw_html)
        parser.close()
    except Exception:
        return ExtractedPage(title="", body="")
    return parser.result()


def fragment_text(
    text: str,
    *,
    title: str,
    source_url: str,
    category: str,
    chunk_size: int = 500,
) -> list[dict[str, Any]]:
    words = text.split()
    if not words:
        return []

    scraped_at = date.today().isoformat()
    url_digest = hashlib.sha256(source_url.encode()).hexdigest()[:12]
    chunks: list[dict[str, Any]] = []
    current: list[str] = []
    current_len = 0
    chunk_index = 0

    def emit() -> None:
        nonlocal current, current_len, chunk_index
        if not current:
            return
        joined = " ".join(current)
        chunk_index += 1
        chunks.append(
            {
                "id": f"scrp_{url_digest}-c{chunk_index:03d}",
                "content": joined,
                "source_url": source_url,
                "scraped_at": scraped_at,
                "category": category,
                "title": title or source_url,
            }
        )
        current = []
        current_len = 0

    for word in words:
        current.append(word)
        current_len += len(word) + 1
        if current_len >= chunk_size:
            emit()
    emit()
    return chunks


@dataclass
class ScrapeSeed:
    url: str
    category: str


@dataclass
class ScraperRuntimeConfig:
    chunk_size: int = 500
    workers: int = 4
    request_timeout_sec: int = 10
    max_page_bytes: int = 31_457_280
    user_agent: str = "EthioBerg-WebScraper/1.0 (ECMA/ESX Research)"
    default_rate_delay_ms: int = 250
    seeds: list[ScrapeSeed] | None = None


def fetch_page(client: httpx.Client, url: str, *, max_bytes: int, timeout: float) -> str:
    response = client.get(url, timeout=timeout, follow_redirects=True)
    response.raise_for_status()
    content = response.content
    if len(content) > max_bytes:
        content = content[:max_bytes]
    return content.decode("utf-8", errors="ignore")


def scrape_seeds(
    config: ScraperRuntimeConfig,
    *,
    on_url_scraped: Callable[[str, list[dict[str, Any]]], None] | None = None,
    on_progress: Callable[[int, str], None] | None = None,
    should_stop: Callable[[], bool] | None = None,
) -> tuple[list[dict[str, Any]], list[str]]:
    """Fetch configured seed URLs and return chunk records + log lines."""
    logs: list[str] = []
    all_chunks: list[dict[str, Any]] = []
    delay_sec = max(config.default_rate_delay_ms, 0) / 1000.0
    host_last_fetch: dict[str, float] = {}

    headers = {"User-Agent": config.user_agent}
    timeout = float(config.request_timeout_sec)

    with httpx.Client(headers=headers) as client:
        for seed in config.seeds or []:
            if should_stop and should_stop():
                logs.append(f"Scrape stopped before {seed.url}")
                break

            host = urlparse(seed.url).netloc
            last = host_last_fetch.get(host, 0.0)
            wait = delay_sec - (time.monotonic() - last)
            if wait > 0:
                time.sleep(wait)

            try:
                raw_html = fetch_page(
                    client,
                    seed.url,
                    max_bytes=config.max_page_bytes,
                    timeout=timeout,
                )
                host_last_fetch[host] = time.monotonic()
                doc = extract_from_html(raw_html)
                body = clean_text(doc.body)
                if not body:
                    logs.append(f"No extractable body for {seed.url}")
                    continue
                chunks = fragment_text(
                    body,
                    title=doc.title,
                    source_url=seed.url,
                    category=seed.category,
                    chunk_size=config.chunk_size,
                )
                if not chunks:
                    logs.append(f"No chunks produced for {seed.url}")
                    continue
                if on_url_scraped:
                    on_url_scraped(seed.url, chunks)
                all_chunks.extend(chunks)
                logs.append(f"Synced {len(chunks)} chunks from {seed.url}")
                if on_progress:
                    on_progress(len(chunks), seed.url)
            except Exception as exc:
                logs.append(f"Failed {seed.url}: {exc}")

    return all_chunks, logs
