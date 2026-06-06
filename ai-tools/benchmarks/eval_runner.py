#!/usr/bin/env python3
# <AI-Generated START>
"""Benchmark runner for pi-packages skill files.

Loads the skill file for a given package as the Ollama system prompt, sends each
eval question, scores the response against automated checks, and reports results.

Exit code: 0 if all evaluated packages score >= 75%, 1 otherwise.

Usage:
    python eval_runner.py --package pi-python
    python eval_runner.py --all --model codestral:22b --base-url http://mac-mini:11434
    python eval_runner.py --all --output json > results.json
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).parent.parent.parent
EVALS_DIR = Path(__file__).parent / "evals"
PACKAGES_DIR = REPO_ROOT / "packages"

PASS_THRESHOLD = 0.75
DEFAULT_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "phi4:14b"
DEFAULT_TIMEOUT = 120.0

ALL_PACKAGES = [
    "pi-dotnet",
    "pi-php",
    "pi-python",
    "pi-robotics",
    "pi-industrial",
    "pi-rust",
]


def load_skill(package: str) -> str:
    pkg_type = package.removeprefix("pi-")
    path = PACKAGES_DIR / package / "skills" / f"{pkg_type}.md"
    return path.read_text(encoding="utf-8")


def load_evals(package: str) -> dict[str, Any]:
    path = EVALS_DIR / f"{package}.json"
    return json.loads(path.read_text(encoding="utf-8"))


def extract_code_blocks(text: str) -> list[str]:
    return re.findall(r"```[\w]*\n?(.*?)```", text, re.DOTALL)


def run_check(check: dict[str, Any], response: str) -> tuple[bool, str]:
    check_type = check["type"]
    raw_value = check.get("value", "")
    case_sensitive: bool = check.get("case_sensitive", False)

    haystack = response if case_sensitive else response.lower()

    if isinstance(raw_value, str):
        needle: str = raw_value if case_sensitive else raw_value.lower()
    else:
        needle = raw_value  # type: ignore[assignment]

    if check_type == "contains":
        return needle in haystack, f"must contain: {raw_value!r}"

    if check_type == "not_contains":
        return needle not in haystack, f"must not contain: {raw_value!r}"

    if check_type == "regex":
        flags = 0 if case_sensitive else re.IGNORECASE
        ok = bool(re.search(str(raw_value), response, flags | re.DOTALL))
        return ok, f"must match regex: {raw_value!r}"

    if check_type == "not_regex":
        flags = 0 if case_sensitive else re.IGNORECASE
        ok = not bool(re.search(str(raw_value), response, flags | re.DOTALL))
        return ok, f"must not match regex: {raw_value!r}"

    if check_type == "has_code_block":
        blocks = extract_code_blocks(response)
        return len(blocks) > 0, "must contain at least one fenced code block"

    if check_type == "first_code_block_contains":
        blocks = extract_code_blocks(response)
        if not blocks:
            return False, "no code block found in response"
        first = blocks[0] if case_sensitive else blocks[0].lower()
        return needle in first, f"first code block must contain: {raw_value!r}"

    if check_type == "code_block_max":
        limit = int(raw_value)
        blocks = extract_code_blocks(response)
        return (
            len(blocks) <= limit,
            f"expected at most {limit} code block(s), got {len(blocks)}",
        )

    raise ValueError(f"Unknown check type: {check_type!r}")


def query_ollama(
    base_url: str,
    model: str,
    system: str,
    user: str,
    timeout: float,
) -> str:
    payload = json.dumps(
        {
            "model": model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "stream": False,
        }
    ).encode()

    req = urllib.request.Request(
        f"{base_url}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        body = json.loads(resp.read())
    return str(body["message"]["content"])


def run_question(
    question: dict[str, Any],
    skill: str,
    base_url: str,
    model: str,
    timeout: float,
) -> dict[str, Any]:
    t0 = time.monotonic()
    error: str | None = None
    response = ""

    try:
        response = query_ollama(base_url, model, skill, question["prompt"], timeout)
    except (urllib.error.URLError, KeyError, json.JSONDecodeError) as exc:
        error = str(exc)

    elapsed = round(time.monotonic() - t0, 1)

    check_results = []
    for c in question.get("checks", []):
        passed, description = run_check(c, response)
        check_results.append({"passed": passed, "description": description})

    all_passed = error is None and all(r["passed"] for r in check_results)

    return {
        "id": question["id"],
        "category": question.get("category", ""),
        "passed": all_passed,
        "error": error,
        "checks": check_results,
        "elapsed": elapsed,
        "response_preview": response[:300],
    }


def print_report(package: str, results: list[dict[str, Any]], model: str) -> None:
    passed_count = sum(1 for r in results if r["passed"])
    total = len(results)
    pct = passed_count / total * 100 if total else 0.0
    threshold_pct = PASS_THRESHOLD * 100

    sep = "=" * 64
    print(f"\n{sep}")
    print(f"  Package : {package}")
    print(f"  Model   : {model}")
    print(f"  Score   : {passed_count}/{total}  ({pct:.0f}%)  — need {threshold_pct:.0f}%")
    print(sep)

    for r in results:
        icon = "+" if r["passed"] else "-"
        print(f"  [{icon}] {r['id']:<24} [{r['category']:<15}]  {r['elapsed']:.1f}s")
        if r["error"]:
            print(f"      ERROR: {r['error']}")
        elif not r["passed"]:
            for c in r["checks"]:
                if not c["passed"]:
                    print(f"      ! {c['description']}")

    print(sep)
    verdict = "PASS" if pct >= threshold_pct else "FAIL"
    print(f"  Result  : {verdict}  ({pct:.0f}%)")
    print(f"{sep}\n")


def run_package(
    package: str,
    base_url: str,
    model: str,
    timeout: float,
    verbose: bool = False,
) -> list[dict[str, Any]]:
    skill = load_skill(package)
    questions = load_evals(package)["questions"]

    results: list[dict[str, Any]] = []
    for q in questions:
        print(f"  {q['id']:<26}", end="", flush=True)
        result = run_question(q, skill, base_url, model, timeout)
        status = "OK  " if result["passed"] else "FAIL"
        print(f"{status}  ({result['elapsed']:.1f}s)")
        if verbose and not result["passed"]:
            print(f"    preview: {result['response_preview']!r}")
        results.append(result)

    return results


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Evaluate pi-packages skill files against a local Ollama endpoint.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--package",
        choices=[*ALL_PACKAGES, "all"],
        default="all",
        help="Package to benchmark, or 'all'.",
    )
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Ollama model tag.")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help="Ollama base URL.")
    parser.add_argument(
        "--timeout",
        type=float,
        default=DEFAULT_TIMEOUT,
        help="Per-question timeout in seconds.",
    )
    parser.add_argument("--verbose", action="store_true", help="Print response preview on failure.")
    parser.add_argument(
        "--output",
        choices=["text", "json"],
        default="text",
        help="Output format.",
    )
    args = parser.parse_args()

    packages = ALL_PACKAGES if args.package == "all" else [args.package]
    all_results: dict[str, list[dict[str, Any]]] = {}
    overall_pass = True

    for pkg in packages:
        print(f"\nEvaluating {pkg} …")
        results = run_package(pkg, args.base_url, args.model, args.timeout, args.verbose)
        all_results[pkg] = results

        passed_count = sum(1 for r in results if r["passed"])
        pct = passed_count / len(results) * 100 if results else 0.0
        if pct < PASS_THRESHOLD * 100:
            overall_pass = False

        if args.output == "text":
            print_report(pkg, results, args.model)

    if args.output == "json":
        print(json.dumps(all_results, indent=2))

    return 0 if overall_pass else 1


if __name__ == "__main__":
    sys.exit(main())
# <AI-Generated END>
