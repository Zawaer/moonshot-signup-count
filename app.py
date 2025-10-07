#!/usr/bin/env python3
"""Simple fetcher for https://moonshot.hackclub.com/api/stats

Hardcoded for GitHub Actions use: fetch once, write to data.csv if count >= MIN_COUNT.
"""
import csv
import datetime
import json
import os
import sys
import time
import urllib.request

URL = "https://moonshot.hackclub.com/api/stats"
CSV_FILE = "data.csv"
MIN_COUNT = 400
TIMEOUT = 20.0
RETRIES = 3


def fetch_count() -> int:
	"""Fetch the count from the API."""
	req = urllib.request.Request(URL, headers={"User-Agent": "moonshot-fetcher/1"})
	with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
		body = resp.read().decode("utf-8")
	obj = json.loads(body)
	return int(obj["count"])


def iso_utc_now() -> str:
	"""Return current UTC time in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ"""
	return datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def append_csv(timestamp: str, count: int) -> None:
	"""Append a timestamped count to the CSV file."""
	exists = os.path.exists(CSV_FILE)
	with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
		w = csv.writer(f)
		if not exists:
			w.writerow(["timestamp", "count"])
		w.writerow([timestamp, count])


def main() -> int:
	"""Fetch count and append to CSV if >= MIN_COUNT."""
	# Try fetching with retries
	for attempt in range(1, RETRIES + 1):
		try:
			count = fetch_count()
			break
		except Exception as err:
			print(f"fetch attempt {attempt} failed: {err}", file=sys.stderr)
			if attempt == RETRIES:
				print("all retries exhausted", file=sys.stderr)
				return 2
			time.sleep(1)

	# Check minimum count threshold
	if count < MIN_COUNT:
		print(f"{iso_utc_now()} fetched {count} < min_count ({MIN_COUNT}); skipping write")
		return 3

	# Write to CSV
	ts = iso_utc_now()
	append_csv(ts, count)
	print(f"{ts} {count} -> {CSV_FILE}")
	return 0


if __name__ == "__main__":
	raise SystemExit(main())
