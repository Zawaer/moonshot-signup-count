#!/usr/bin/env python3
"""Simple fetcher for https://moonshot.hackclub.com/api/stats

Saves timestamped counts to a CSV (default: data.csv).
"""
from __future__ import annotations

import argparse
import csv
import datetime
import json
import os
import sys
import time
import urllib.request
from typing import Optional

URL = "https://moonshot.hackclub.com/api/stats"


def fetch_count(timeout: float = 10.0) -> int:
	req = urllib.request.Request(URL, headers={"User-Agent": "moonshot-fetcher/1"})
	with urllib.request.urlopen(req, timeout=timeout) as resp:
		body = resp.read().decode("utf-8")
	obj = json.loads(body)
	return int(obj["count"])


def iso_utc_now() -> str:
	return datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def append_csv(path: str, timestamp: str, count: int) -> None:
	exists = os.path.exists(path)
	# create parent dir if necessary
	parent = os.path.dirname(os.path.abspath(path))
	if parent and not os.path.exists(parent):
		os.makedirs(parent, exist_ok=True)
	with open(path, "a", newline="", encoding="utf-8") as f:
		w = csv.writer(f)
		if not exists:
			w.writerow(["timestamp", "count"])
		w.writerow([timestamp, count])


def do_fetch_and_store(csv_file: str, timeout: float, retries: int) -> int:
	for attempt in range(1, retries + 1):
		try:
			count = fetch_count(timeout=timeout)
			ts = iso_utc_now()
			append_csv(csv_file, ts, count)
			print(f"{ts} {count} -> {csv_file}")
			return 0
		except Exception as err:
			print(f"fetch attempt {attempt} failed: {err}", file=sys.stderr)
			if attempt == retries:
				print("all retries exhausted", file=sys.stderr)
				return 2
			time.sleep(1)


def main(argv: Optional[list[str]] = None) -> int:
	p = argparse.ArgumentParser(description="Fetch moonshot signup count and save to CSV")
	p.add_argument("--once", action="store_true", help="Fetch once and exit (default)")
	p.add_argument("--interval", type=float, help="Seconds between repeated fetches (loop mode)")
	p.add_argument("--csv-file", default="data.csv", help="CSV file to append to")
	p.add_argument("--timeout", type=float, default=10.0, help="HTTP timeout in seconds")
	p.add_argument("--retries", type=int, default=3, help="Number of fetch retries before failing")
	args = p.parse_args(argv)

	# default behavior: one-shot
	if not args.interval:
		args.once = True

	if args.once:
		return do_fetch_and_store(args.csv_file, timeout=args.timeout, retries=args.retries)

	# loop mode
	try:
		while True:
			code = do_fetch_and_store(args.csv_file, timeout=args.timeout, retries=args.retries)
			if code != 0:
				print("fetch failed; will retry after interval", file=sys.stderr)
			time.sleep(args.interval)
	except KeyboardInterrupt:
		print("stopping")
		return 0


if __name__ == "__main__":
	raise SystemExit(main())
