# Moonshot Signup Counter

A tiny project that collects Moonshot signup counts and shows them in a simple web dashboard.

## How it works
- A Python script polls the Moonshot stats API and appends timestamped counts to `data.csv` (stored in the repo).
- The python script is automated to run every 5 minutes with GitHub Actions
- A Next.js frontend (in `app/`) reads `data.csv` (from the GitHub raw URL) and displays it along with a signup history chart
