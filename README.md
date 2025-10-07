# Moonshot signup fetcher

This small Python script fetches the signup count from https://moonshot.hackclub.com/api/stats and appends timestamped values to `data.csv`.

# Moonshot signup fetcher

This small Python script fetches the signup count from https://moonshot.hackclub.com/api/stats and appends timestamped values to `data.csv`.

Requirements

- Python 3.10+ (the script uses modern type hints such as `int | None`).
- No third-party dependencies; uses only the standard library.

What the script does

- Fetches the JSON at `https://moonshot.hackclub.com/api/stats` and reads the `count` field.
- If the fetched count is >= MIN_COUNT, the script appends a row to `data.csv` with the current UTC timestamp and the count.
- If the count is below MIN_COUNT the script will retry the whole fetch up to LOW_ATTEMPTS times, waiting LOW_DELAY seconds between attempts. Each fetch attempt itself uses a short network retry loop (RETRIES).
- The script writes nothing if all low-count attempts are exhausted or if the network retries fail repeatedly.

Configuration

The following constants are defined at the top of `app.py` and can be adjusted there:

- `URL` — API endpoint (default: `https://moonshot.hackclub.com/api/stats`)
- `CSV_FILE` — output CSV path (default: `data.csv`)
- `MIN_COUNT` — minimum count threshold to write (default: `400`)
- `TIMEOUT` — network timeout seconds
- `RETRIES` — number of network retries per fetch attempt (default: `3`)
- `LOW_ATTEMPTS` — number of low-count retries (default: `5`)
- `LOW_DELAY` — seconds to wait between low-count retries (default: `10`)

Usage

Run once from the repo root:

```powershell
python .\app.py
```

The script is designed for one-shot execution (suitable for running from a scheduler). It prints a concise success line to stdout when it writes the CSV and logs errors or retry messages to stderr.

Exit codes

- `0` — success; a row was written to the CSV
- `2` — network retries exhausted (couldn't fetch from the API)
- `3` — all low-count attempts exhausted; fetched values were consistently below `MIN_COUNT`, so nothing was written

CSV format

The CSV will be created if missing and has the header `timestamp,count`. Rows look like:

```
timestamp,count
2025-10-07T12:34:56Z,441
```

Notes and tips

- The script stores data on the local filesystem. If you run it on a platform with an ephemeral filesystem (serverless platforms like Vercel), you should send results to an external persistent store (database, S3, Supabase, Google Sheet) instead of relying on `data.csv`.
- For regular polling, run the script from a scheduler (cron on a VPS, GitHub Actions, or an HTTP cron that hits a server endpoint). If you want near-exact 5-minute cadence, consider a cloud scheduler (EventBridge / Cloud Scheduler) or a small VPS with cron.
- Tweak the constants in `app.py` if you want different retry behavior or thresholds.

If you'd like, I can also add a tiny wrapper that exposes this as an HTTP endpoint or convert the logic to a small Docker image for easier scheduling.
