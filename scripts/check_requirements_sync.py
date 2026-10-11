#!/usr/bin/env python3
"""Fail when api/requirements.txt drifts from shared root dependency pins."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROOT_REQUIREMENTS = ROOT / "requirements.txt"
API_REQUIREMENTS = ROOT / "api" / "requirements.txt"


def package_name(requirement: str) -> str:
    """Return a PEP 503-style normalized base package name."""
    left = requirement.split("==", 1)[0].strip()
    base = left.split("[", 1)[0]
    return re.sub(r"[-_.]+", "-", base).lower()


def read_pins(path: Path) -> dict[str, str]:
    pins: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        if "==" not in line:
            raise SystemExit(f"{path}: dependency is not exactly pinned: {line}")
        name = package_name(line)
        if name in pins:
            raise SystemExit(f"{path}: duplicate dependency for {name}: {line}")
        pins[name] = line
    return pins


def main() -> int:
    root_pins = read_pins(ROOT_REQUIREMENTS)
    api_pins = read_pins(API_REQUIREMENTS)

    errors: list[str] = []

    for name, api_pin in sorted(api_pins.items()):
        root_pin = root_pins.get(name)
        if root_pin is None:
            errors.append(f"{name}: present in api/requirements.txt but missing from requirements.txt")
        elif root_pin != api_pin:
            errors.append(
                f"{name}: pin drift\n"
                f"  requirements.txt:     {root_pin}\n"
                f"  api/requirements.txt: {api_pin}"
            )

    if errors:
        print("Dependency manifest drift detected:\n")
        print("\n".join(f"- {error}" for error in errors))
        return 1

    print(
        f"Requirements are synchronized for all {len(api_pins)} API dependencies "
        f"(root contains {len(root_pins)} total dependencies)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
