#!/usr/bin/env python3
"""Parse regulatory PDF folders and upsert chunks into Pinecone."""

from __future__ import annotations

import argparse
import hashlib
import os
import re
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from pinecone import Pinecone

BACKEND_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = BACKEND_ROOT.parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from src.services.ingestion import normalize_text, parse_document  # noqa: E402

DEFAULT_FOLDERS = ("Directives", "Guidelines", "Proclamations", "Draft-Directives")
MAX_CHUNK_CHARS = 1500
BATCH_SIZE = 96
NAMESPACE = "regulatory"


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return slug[:80] or "doc"


def detect_language(filename: str) -> str:
    if re.search(r"(amh|amharic|አማ)", filename, re.IGNORECASE):
        return "am"
    if re.search(r"[\u1200-\u137F]", filename):
        return "am"
    return "en"


def chunk_page_text(text: str, *, max_chars: int = MAX_CHUNK_CHARS) -> list[str]:
    normalized = normalize_text(text)
    if not normalized:
        return []
    if len(normalized) <= max_chars:
        return [normalized]

    paragraphs = [part.strip() for part in re.split(r"\n{2,}", text) if part.strip()]
    if not paragraphs:
        paragraphs = [normalized]

    chunks: list[str] = []
    current = ""
    for paragraph in paragraphs:
        paragraph = normalize_text(paragraph)
        if not paragraph:
            continue
        if len(paragraph) > max_chars:
            if current:
                chunks.append(current)
                current = ""
            for start in range(0, len(paragraph), max_chars):
                chunks.append(paragraph[start : start + max_chars])
            continue
        candidate = f"{current} {paragraph}".strip() if current else paragraph
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                chunks.append(current)
            current = paragraph
    if current:
        chunks.append(current)
    return chunks


def build_records_for_pdf(pdf_path: Path, *, folder_name: str) -> tuple[list[dict], int]:
    document = parse_document(pdf_path.name, pdf_path.read_bytes())
    language = detect_language(pdf_path.name)
    source_id = hashlib.sha256(str(pdf_path).encode()).hexdigest()[:16]
    file_slug = slugify(pdf_path.stem)
    records: list[dict] = []
    skipped_pages = 0

    for page in document.pages:
        page_chunks = chunk_page_text(page.text)
        if not page_chunks:
            skipped_pages += 1
            continue
        for chunk_index, chunk_text in enumerate(page_chunks, start=1):
            record_id = f"{folder_name}-{file_slug}-p{page.page_number:03d}-c{chunk_index:02d}"
            records.append(
                {
                    "_id": record_id,
                    "text": chunk_text,
                    "source_id": source_id,
                    "source_title": pdf_path.stem,
                    "source_folder": folder_name,
                    "source_file": pdf_path.name,
                    "page": page.page_number,
                    "language": language,
                    "doc_type": folder_name.lower(),
                }
            )
    return records, skipped_pages


def collect_pdf_paths(folders: list[str]) -> list[tuple[str, Path]]:
    paths: list[tuple[str, Path]] = []
    for folder in folders:
        folder_path = REPO_ROOT / folder
        if not folder_path.exists():
            print(f"Skipping missing folder: {folder_path}")
            continue
        for pdf_path in sorted(folder_path.glob("*.pdf")):
            paths.append((folder, pdf_path))
    return paths


def upsert_batches(index, records: list[dict], *, namespace: str) -> None:
    for start in range(0, len(records), BATCH_SIZE):
        batch = records[start : start + BATCH_SIZE]
        index.upsert_records(namespace=namespace, records=batch)
        print(f"  upserted batch {start // BATCH_SIZE + 1} ({len(batch)} records)")


def search_examples(index, *, namespace: str) -> None:
    examples = [
        "What are the AML and KYC requirements for capital market service providers?",
        "What does the Capital Market Proclamation say about licensing?",
        "What are the supervision guidelines for exchanges and market infrastructures?",
        "What are the requirements for public offering of securities?",
        "What is dematerialization of securities?",
    ]
    print("\n=== Sample queries ===")
    for question in examples:
        results = index.search(
            namespace=namespace,
            query={"inputs": {"text": question}, "top_k": 3},
            fields=["text", "source_title", "source_folder", "page", "language"],
        )
        print(f"\nQ: {question}")
        if not results.result.hits:
            print("  (no hits)")
            continue
        for hit in results.result.hits:
            fields = hit.fields
            snippet = fields.get("text", "")[:180].replace("\n", " ")
            print(
                f"  score={hit.score:.3f} | {fields.get('source_folder')} | "
                f"{fields.get('source_title')} | p.{fields.get('page')} | {snippet}..."
            )


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload regulatory PDFs to Pinecone.")
    parser.add_argument(
        "--folders",
        nargs="+",
        default=list(DEFAULT_FOLDERS),
        help="Top-level folders under the repo root containing PDFs.",
    )
    parser.add_argument("--namespace", default=NAMESPACE)
    parser.add_argument("--query-only", action="store_true", help="Skip upload and run sample queries.")
    parser.add_argument("--wait-seconds", type=int, default=20)
    args = parser.parse_args()

    load_dotenv(BACKEND_ROOT / ".env")
    api_key = os.environ.get("PINECONE_API_KEY")
    index_name = os.environ.get("PINECONE_INDEX_NAME", "ethioberg-regulatory")
    if not api_key:
        print("Missing PINECONE_API_KEY in backend/.env", file=sys.stderr)
        return 1

    pc = Pinecone(api_key=api_key)
    index = pc.Index(index_name)

    if not args.query_only:
        all_records: list[dict] = []
        empty_files: list[str] = []

        for folder_name, pdf_path in collect_pdf_paths(args.folders):
            print(f"\nProcessing {folder_name}/{pdf_path.name}")
            records, skipped_pages = build_records_for_pdf(pdf_path, folder_name=folder_name)
            if not records:
                empty_files.append(f"{folder_name}/{pdf_path.name}")
                print(f"  skipped: no extractable text ({skipped_pages} pages scanned/image-only)")
                continue
            print(f"  extracted {len(records)} chunks from {len(records) + skipped_pages} pages")
            all_records.extend(records)

        if not all_records:
            print("\nNo records to upload.", file=sys.stderr)
            return 1

        print(f"\nUploading {len(all_records)} total records to namespace '{args.namespace}'...")
        upsert_batches(index, all_records, namespace=args.namespace)
        print(f"Waiting {args.wait_seconds}s for embeddings...")
        time.sleep(args.wait_seconds)
        print(index.describe_index_stats())

        if empty_files:
            print("\nSkipped image-only/scanned PDFs (need OCR to use):")
            for name in empty_files:
                print(f"  - {name}")

    search_examples(index, namespace=args.namespace)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
