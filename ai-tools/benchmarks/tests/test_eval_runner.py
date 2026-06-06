# <AI-Generated START>
"""Unit tests for eval_runner — exercises check logic without Ollama calls."""
from __future__ import annotations

import pytest

from eval_runner import extract_code_blocks, run_check


# ---------------------------------------------------------------------------
# extract_code_blocks
# ---------------------------------------------------------------------------


def test_extract_code_blocks_empty():
    assert extract_code_blocks("no blocks here") == []


def test_extract_code_blocks_single():
    text = "```python\nprint('hello')\n```"
    blocks = extract_code_blocks(text)
    assert len(blocks) == 1
    assert "print('hello')" in blocks[0]


def test_extract_code_blocks_multiple():
    text = "```python\nfoo()\n```\nsome text\n```rust\nbar();\n```"
    blocks = extract_code_blocks(text)
    assert len(blocks) == 2


def test_extract_code_blocks_no_lang():
    text = "```\ncode here\n```"
    blocks = extract_code_blocks(text)
    assert len(blocks) == 1
    assert "code here" in blocks[0]


# ---------------------------------------------------------------------------
# run_check: contains
# ---------------------------------------------------------------------------


def test_contains_found():
    check = {"type": "contains", "value": "async def"}
    passed, _ = run_check(check, "here is async def get_user(): ...")
    assert passed


def test_contains_not_found():
    check = {"type": "contains", "value": "async def"}
    passed, msg = run_check(check, "def get_user(): ...")
    assert not passed
    assert "async def" in msg


def test_contains_case_insensitive():
    check = {"type": "contains", "value": "BASEMODEL"}
    passed, _ = run_check(check, "class Foo(BaseModel): ...")
    assert passed


# ---------------------------------------------------------------------------
# run_check: not_contains
# ---------------------------------------------------------------------------


def test_not_contains_absent():
    check = {"type": "not_contains", "value": ".unwrap()"}
    passed, _ = run_check(check, "let x = foo()?;")
    assert passed


def test_not_contains_present():
    check = {"type": "not_contains", "value": ".unwrap()"}
    passed, _ = run_check(check, "let x = foo().unwrap();")
    assert not passed


# ---------------------------------------------------------------------------
# run_check: regex / not_regex
# ---------------------------------------------------------------------------


def test_regex_matches():
    check = {"type": "regex", "value": r"def test_\w+"}
    passed, _ = run_check(check, "def test_calculate_total():")
    assert passed


def test_regex_no_match():
    check = {"type": "regex", "value": r"def test_\w+"}
    passed, _ = run_check(check, "def calculate_total():")
    assert not passed


def test_not_regex_absent():
    check = {"type": "not_regex", "value": r"\.unwrap\(\)"}
    passed, _ = run_check(check, "let x = foo()?;")
    assert passed


def test_not_regex_present():
    check = {"type": "not_regex", "value": r"\.unwrap\(\)"}
    passed, _ = run_check(check, "let x = foo().unwrap();")
    assert not passed


# ---------------------------------------------------------------------------
# run_check: has_code_block
# ---------------------------------------------------------------------------


def test_has_code_block_yes():
    check = {"type": "has_code_block"}
    passed, _ = run_check(check, "```python\ncode\n```")
    assert passed


def test_has_code_block_no():
    check = {"type": "has_code_block"}
    passed, _ = run_check(check, "just prose, no code blocks")
    assert not passed


# ---------------------------------------------------------------------------
# run_check: first_code_block_contains
# ---------------------------------------------------------------------------


def test_first_code_block_contains_yes():
    check = {"type": "first_code_block_contains", "value": "def test_"}
    text = (
        "```python\ndef test_foo():\n    pass\n```\n"
        "```python\ndef foo():\n    pass\n```"
    )
    passed, _ = run_check(check, text)
    assert passed


def test_first_code_block_contains_no():
    check = {"type": "first_code_block_contains", "value": "def test_"}
    text = (
        "```python\ndef foo():\n    pass\n```\n"
        "```python\ndef test_foo():\n    pass\n```"
    )
    passed, _ = run_check(check, text)
    assert not passed


def test_first_code_block_contains_no_blocks():
    check = {"type": "first_code_block_contains", "value": "def test_"}
    passed, msg = run_check(check, "no code blocks here")
    assert not passed
    assert "no code block" in msg


# ---------------------------------------------------------------------------
# run_check: code_block_max
# ---------------------------------------------------------------------------


def test_code_block_max_under():
    check = {"type": "code_block_max", "value": 3}
    text = "```\nA\n```\n```\nB\n```"
    passed, _ = run_check(check, text)
    assert passed


def test_code_block_max_at_limit():
    check = {"type": "code_block_max", "value": 2}
    text = "```\nA\n```\n```\nB\n```"
    passed, _ = run_check(check, text)
    assert passed


def test_code_block_max_over():
    check = {"type": "code_block_max", "value": 2}
    text = "```\nA\n```\n```\nB\n```\n```\nC\n```"
    passed, msg = run_check(check, text)
    assert not passed
    assert "3" in msg
# <AI-Generated END>
