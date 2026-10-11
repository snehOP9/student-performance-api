"""Run the core contributor verification checks from the repository root."""

from __future__ import annotations

import shutil
import subprocess
import sys


def run(command: list[str]) -> None:
    print("+", " ".join(command), flush=True)
    subprocess.run(command, check=True)


def main() -> int:
    npm = shutil.which("npm")
    if npm is None:
        print("npm was not found on PATH.", file=sys.stderr)
        return 1

    run([sys.executable, "-m", "pytest"])
    run([npm, "--prefix", "student-performance-predictor-pro", "run", "build"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
