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
LOW_ATTEMPTS = 5
LOW_DELAY = 10


def fetch_count() -> int:
	"""Fetch the count from the API."""
	req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0"})
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
	def _fetch_with_network_retries() -> int | None:
		"""Try fetching count with network retries. Return int on success, None if all network retries fail."""
		for attempt in range(1, RETRIES + 1):
			try:
				return fetch_count()
			except Exception as err:
				print(f"fetch attempt {attempt} failed: {err}", file=sys.stderr)
				if attempt == RETRIES:
					print("network retries exhausted for this fetch attempt", file=sys.stderr)
					return None
				time.sleep(1)

	# If the count is below MIN_COUNT, retry the whole fetch (including network retries) up to LOW_ATTEMPTS
	for low_attempt in range(1, LOW_ATTEMPTS + 1):
		count = _fetch_with_network_retries()
		if count is None:
			# network failed for this low_attempt; if this was the last allowed attempt, treat as network failure
			if low_attempt == LOW_ATTEMPTS:
				return 2
			print(f"attempt {low_attempt}/{LOW_ATTEMPTS}: network failure, will retry after {LOW_DELAY}s", file=sys.stderr)
			time.sleep(LOW_DELAY)
			continue

		if count < MIN_COUNT:
			print(f"{iso_utc_now()} fetched {count} < min_count ({MIN_COUNT}); attempt {low_attempt}/{LOW_ATTEMPTS}")
			if low_attempt == LOW_ATTEMPTS:
				# all low-count attempts exhausted; do not write
				print("all low-count attempts exhausted; skipping write")
				return 3
			# wait then retry
			time.sleep(LOW_DELAY)
			continue

		# Success: count >= MIN_COUNT, write to CSV
		ts = iso_utc_now()
		append_csv(ts, count)
		print(f"{ts} {count} -> {CSV_FILE}")
		return 0


if __name__ == "__main__":
	raise SystemExit(main())
