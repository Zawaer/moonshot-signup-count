# Moonshot signup fetcher

This small Python script fetches the signup count from https://moonshot.hackclub.com/api/stats and appends timestamped values to `data.csv`.

Usage

One-shot fetch and append:

```powershell
python .\app.py --once --csv-file data.csv
```

Loop mode (fetch every 300 seconds):

```powershell
python .\app.py --interval 300 --csv-file data.csv
```

CSV Format

The CSV file has a header row and then rows like:

timestamp,count
2025-10-07T12:34:56Z,441

Notes

- Uses only Python standard library (no dependencies).
- Default CSV file is `data.csv` in the repo root.
- Script prints a short line for each successful fetch and logs failures to stderr.
