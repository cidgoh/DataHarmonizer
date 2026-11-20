#!/usr/bin/env python3
"""
Run Playwright tests one-at-a-time in headed (browser-visible) mode.

UX_ tests run first in numeric order (task_1 → task_5), then all other test
files in alphabetical order.  Each file is a separate `npx playwright test`
invocation so test state is fully isolated between files.

Usage (from the repo root):
    python tests/playwright/run_tests_headed.py
    python tests/playwright/run_tests_headed.py --slow 2000
    python tests/playwright/run_tests_headed.py --no-slow
    python tests/playwright/run_tests_headed.py --filter UX
    python tests/playwright/run_tests_headed.py --filter SCHEMA_enum --slow 500

Options:
    --slow N    slowMo delay between user actions in ms (default: 1000)
    --no-slow   disable slowMo (equivalent to --slow 0)
    --filter P  only run files whose name contains P (case-insensitive)
    --dry-run   print the run order without executing

Environment variables passed to each test:
    HEADED=1      opens Chromium in a visible window
    PWSLOW=<ms>   per-action delay (read by playwright.config.js)
"""

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent.resolve()
REPO_ROOT   = SCRIPT_DIR.parent.parent.resolve()   # …/DataHarmonizer

# ── Arguments ─────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(
    description=__doc__,
    formatter_class=argparse.RawDescriptionHelpFormatter,
)
parser.add_argument(
    '--slow', type=int, default=1000, metavar='MS',
    help='slowMo delay in ms between user actions (default: 1000)',
)
parser.add_argument(
    '--no-slow', action='store_true',
    help='disable slowMo',
)
parser.add_argument(
    '--filter', default='', metavar='PATTERN',
    help='only run files whose name contains PATTERN (case-insensitive)',
)
parser.add_argument(
    '--dry-run', action='store_true',
    help='print run order without executing any tests',
)
args = parser.parse_args()

slow_ms = 0 if args.no_slow else args.slow

# ── Discover and order test files ─────────────────────────────────────────────
all_specs = sorted(SCRIPT_DIR.glob('*.spec.js'))


def _sort_key(p):
    name = p.name
    # UX tests first, ordered by their embedded task number.
    m = re.search(r'[Uu][Xx].*?(\d+)', name)
    if m:
        return (0, int(m.group(1)), name)
    # Everything else alphabetically.
    return (1, 0, name)


ordered = sorted(all_specs, key=_sort_key)

if args.filter:
    ordered = [p for p in ordered if args.filter.lower() in p.name.lower()]

if not ordered:
    print(f'No test files found matching filter "{args.filter}".')
    sys.exit(1)

# ── Print run plan ─────────────────────────────────────────────────────────────
W = 62
print()
print('─' * W)
print(f'  headed mode : yes (Chromium visible)')
print(f'  slowMo      : {slow_ms} ms per action')
print(f'  filter      : {args.filter or "(all)"}')
print(f'  tests       : {len(ordered)} file(s)')
print('─' * W)
for i, p in enumerate(ordered, 1):
    print(f'  {i:>2}.  {p.name}')
print('─' * W)
print()

if args.dry_run:
    sys.exit(0)

# ── Build environment ─────────────────────────────────────────────────────────
env = os.environ.copy()
env['HEADED'] = '1'
if slow_ms > 0:
    env['PWSLOW'] = str(slow_ms)
else:
    env.pop('PWSLOW', None)

# ── Run each test file ────────────────────────────────────────────────────────
results = []   # [(name, returncode)]

for i, spec in enumerate(ordered, 1):
    label = f'[{i}/{len(ordered)}]  {spec.name}'
    print()
    print('═' * W)
    print(f'  {label}')
    print('═' * W)
    sys.stdout.flush()

    cmd = ['npx', 'playwright', 'test', str(spec), '--reporter=line']
    try:
        proc = subprocess.run(cmd, cwd=str(REPO_ROOT), env=env)
        rc = proc.returncode
    except KeyboardInterrupt:
        print('\n  Interrupted by user — stopping run.')
        sys.exit(130)

    status = '✓  PASSED' if rc == 0 else '✗  FAILED'
    print(f'\n  {label}  →  {status}')
    results.append((spec.name, rc))

# ── Summary ───────────────────────────────────────────────────────────────────
passed = [n for n, rc in results if rc == 0]
failed = [n for n, rc in results if rc != 0]

print()
print('═' * W)
print(f'  SUMMARY  —  {len(passed)} passed,  {len(failed)} failed')
print('═' * W)
if failed:
    for n in failed:
        print(f'  ✗  {n}')
else:
    print('  All tests passed.')
print()

sys.exit(len(failed))
