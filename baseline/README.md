# Baseline Snapshots

This directory (`baseline/`) contains the baseline version of the Shopify
Onboarding UI and baseline screenshots for regression testing.

## Directory Structure

```
baseline/
├── app-ui-design/        # Git submodule: baseline version of the Shopify Onboarding app
│                         # Used to generate baseline screenshots
├── screenshots/          # Baseline screenshots (generated, committed to version control)
│                         # Used as reference for regression testing
└── README.md             # This file
```

## Setup

### Initialize the submodule

```bash
git submodule update --init --recursive
```

### Install dependencies

```bash
cd app-ui-design
npm install
```

### Start the dev server

```bash
npm run dev
```

By default, the dev server runs on `http://localhost:8000`, which matches the
`BASELINE_UI_DESIGN_APP_URL` in `.env.example`.

## Baseline Screenshots Directory

The `screenshots/` directory will be created when you run:

```bash
npm run playwright:generate_screenshots
```

This command:

1. Clears existing baseline screenshots
2. Runs the UI design tests against the baseline app
3. Generates fresh baseline screenshots in `screenshots/`

These screenshots should be committed to version control and compared against
when running regression tests.

## Workflow

1. **Update baseline**: When you want to establish a new baseline
   - Update the submodule to a new commit
   - Run the baseline app locally
   - Run `npm run playwright:generate_screenshots`
   - Commit the new screenshots

2. **Test against baseline**: Run regression tests with
   - `npm run playwright:test` (compares against committed screenshots)
