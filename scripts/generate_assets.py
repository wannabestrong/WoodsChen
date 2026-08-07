#!/usr/bin/env python3
"""Generate OPEN image assets through an OpenAI-compatible image endpoint."""

from __future__ import annotations

import argparse
import base64
import json
import os
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path


DEFAULT_ENDPOINT = "https://api.kakou.com/v1/images/generations"


def create_ssl_context() -> ssl.SSLContext:
    """Use certifi when available without weakening TLS verification."""
    try:
        import certifi
    except ImportError:
        return ssl.create_default_context()
    return ssl.create_default_context(cafile=certifi.where())


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--jobs",
        default="scripts/asset-jobs.json",
        help="JSON file containing generation jobs",
    )
    parser.add_argument("--endpoint", default=os.getenv("KAKOU_IMAGE_ENDPOINT", DEFAULT_ENDPOINT))
    parser.add_argument("--model", default=os.getenv("KAKOU_IMAGE_MODEL"))
    parser.add_argument("--only", action="append", default=[], help="Generate only this job id; repeatable")
    parser.add_argument("--force", action="store_true", help="Replace existing output files")
    parser.add_argument("--dry-run", action="store_true", help="Validate and print jobs without network calls")
    parser.add_argument("--timeout", type=int, default=180)
    return parser.parse_args()


def load_jobs(path: Path) -> list[dict]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    jobs = payload.get("jobs")
    if not isinstance(jobs, list) or not jobs:
        raise ValueError("jobs file must contain a non-empty 'jobs' array")

    seen: set[str] = set()
    for job in jobs:
        for field in ("id", "out", "prompt"):
            if not isinstance(job.get(field), str) or not job[field].strip():
                raise ValueError(f"each job requires a non-empty string field: {field}")
        if job["id"] in seen:
            raise ValueError(f"duplicate job id: {job['id']}")
        seen.add(job["id"])
    return jobs


def build_payload(job: dict, model: str) -> dict:
    payload = {
        "model": model,
        "prompt": job["prompt"],
        "n": 1,
    }
    if job.get("size"):
        payload["size"] = job["size"]
    if job.get("quality"):
        payload["quality"] = job["quality"]

    response_format = os.getenv("KAKOU_RESPONSE_FORMAT", "").strip()
    if response_format:
        payload["response_format"] = response_format
    return payload


def request_image(endpoint: str, api_key: str, payload: dict, timeout: int) -> bytes:
    ssl_context = create_ssl_context()
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=timeout, context=ssl_context) as response:
            body = response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"image endpoint returned HTTP {exc.code}: {detail[:1000]}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"image endpoint request failed: {exc.reason}") from exc

    try:
        result = json.loads(body)
        item = result["data"][0]
    except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
        raise RuntimeError("unexpected image response: expected data[0].url or data[0].b64_json") from exc

    encoded = item.get("b64_json")
    if encoded:
        try:
            return base64.b64decode(encoded, validate=True)
        except (ValueError, TypeError) as exc:
            raise RuntimeError("invalid base64 image payload") from exc

    image_url = item.get("url")
    if image_url:
        try:
            with urllib.request.urlopen(image_url, timeout=timeout, context=ssl_context) as response:
                return response.read()
        except urllib.error.URLError as exc:
            raise RuntimeError(f"generated image download failed: {exc.reason}") from exc

    raise RuntimeError("image response contains neither url nor b64_json")


def write_atomic(path: Path, content: bytes) -> None:
    if len(content) < 1024:
        raise RuntimeError("generated image payload is unexpectedly small")
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = path.with_name(path.name + ".part")
    temp_path.write_bytes(content)
    os.replace(temp_path, path)


def main() -> int:
    args = parse_args()
    jobs_path = Path(args.jobs).resolve()
    jobs = load_jobs(jobs_path)

    if args.only:
        selected = set(args.only)
        known = {job["id"] for job in jobs}
        unknown = selected - known
        if unknown:
            raise ValueError(f"unknown job id(s): {', '.join(sorted(unknown))}")
        jobs = [job for job in jobs if job["id"] in selected]

    if not args.model:
        raise RuntimeError("set KAKOU_IMAGE_MODEL or pass --model; provider model names are not inferred")

    api_key = os.getenv("KAKOU_API_KEY", "")
    if not args.dry_run and not api_key:
        raise RuntimeError("set KAKOU_API_KEY before making network calls")

    failures = 0
    for job in jobs:
        output = Path(job["out"])
        payload = build_payload(job, args.model)

        if output.exists() and not args.force:
            print(f"SKIP {job['id']}: {output} already exists")
            continue
        if args.dry_run:
            safe_payload = {key: value for key, value in payload.items() if key != "prompt"}
            print(f"DRY  {job['id']}: {output} {json.dumps(safe_payload, ensure_ascii=False)}")
            continue

        print(f"RUN  {job['id']}: {output}")
        try:
            image = request_image(args.endpoint, api_key, payload, args.timeout)
            write_atomic(output, image)
            print(f"DONE {job['id']}: {len(image)} bytes")
        except Exception as exc:  # Continue the batch while retaining a failing exit code.
            failures += 1
            print(f"FAIL {job['id']}: {exc}", file=sys.stderr)

    return 1 if failures else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
