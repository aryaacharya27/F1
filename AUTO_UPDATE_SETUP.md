# F1 2026 Daily Hub — Automatic Data Updates

This project is configured to update the F1 standings/news automatically with GitHub Actions.

## How it works

Formula 1 / GNews
        ↓
GitHub Actions (scheduled updater)
        ↓
data/f1-data.json
        ↓
GitHub Pages / static hosting
        ↓
Your browser

The GitHub Action runs approximately every 15 minutes. GitHub can delay scheduled workflows, so this should be treated as periodic updating rather than guaranteed real-time data.

The browser checks for fresh JSON every 5 minutes while the page is open.

## 1. Create a GitHub repository

Create a new repository and upload the complete contents of this project.

For the easiest free setup, use a public repository.

## 2. Add the GNews API key

In your GitHub repository:

Settings → Secrets and variables → Actions → New repository secret

Name:
GNEWS_API_KEY

Value:
your GNews API key

Never put the real API key inside index.html or app.js.

## 3. Test the updater

Open:

Actions → Update F1 Data → Run workflow

The workflow should run `backend/update.py` and update:

data/f1-data.json

If the data changed, GitHub Actions commits it automatically.

## 4. Turn on GitHub Pages

For the simplest setup:

Settings → Pages

Set the deployment source to the `main` branch and the repository root (`/`).

After GitHub publishes the site, your address will normally look like:

https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/

## 5. Verify automatic updates

Open:

Actions → Update F1 Data

You should see scheduled workflow runs.

The workflow is configured for every 15 minutes:

*/15 * * * *

GitHub Actions scheduled jobs can sometimes start late because GitHub controls scheduling capacity.

## Important limitations

1. Formula1.com can change its HTML structure. If that happens, the scraper may need an update.
2. GNews has API limits depending on your plan.
3. GitHub Actions is periodic, not true real-time streaming.
4. For very reliable live/near-live data, a dedicated server or scheduled cloud function is better.
