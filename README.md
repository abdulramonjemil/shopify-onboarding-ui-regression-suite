# Shopify Onboarding UI Regression Suite

A comprehensive regression test suite built with **Playwright** and **Passmark**
AI-powered step execution for my
[Shopify Onboarding UI](https://github.com/abdulramonjemil/shopify-onboarding)
project, a frontend project based on a Figma design.

## 🎯 What This Does

This project demonstrates how to write **screenshot-based regression tests** for
a design system by:

1. **Capturing UI Structure** across multiple viewports (Desktop & Mobile)
2. **Testing Interaction States** (hover, active, focus-visible) using Chrome
   DevTools Protocol

Instead of writing brittle selectors and waiting for elements, we simply
describe what we want to happen in plain English, and Passmark figures out how
to do it.

## 🚀 Quick Start

### Prerequisites

- Node.js
- An implementation of the Shopify Onboarding UI running at the configured URL

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your app URL and API keys

# Run tests (compare against baseline screenshots)
npm run playwright:test

# Generate/update baseline screenshots
npm run playwright:generate_screenshots
```

### Git Submodule Setup

The baseline version of the tested Shopify app is included as a git submodule in
`baseline/app-ui-design/`. If you cloned this repo without
`--recurse-submodules`, initialize it:

```bash
git submodule update --init --recursive
```

## 📁 Project Structure

```
├── tests/
│   ├── ui-structure.spec.ts       # UI structure tests (Desktop & Mobile)
│   └── ui-interactions.spec.ts    # Pointer interaction state tests
├── baseline/
│   └── screenshots/               # Reference screenshots for regression
├── src/
│   ├── baseline.ts                # Screenshot configuration
│   └── env.ts                     # Environment setup
├── playwright.config.ts           # Playwright & Passmark config
└── README.md                      # You are here
```

## 🧪 Test Suites

### UI Structure Tests (`ui-structure.spec.ts`)

Tests the visual layout and structure across Desktop (1280×720) and Mobile
(375×667) viewports:

- Homepage default state
- Popover interactions
- Dropdown menu
- Trial offer dismissal
- Checkbox progress states (20% & 100%)
- Accordion item expansion (all 5 items)
- Collapsible sections

### Interaction State Tests (`ui-interactions.spec.ts`)

Uses Chrome DevTools Protocol to force pseudo-states without user interaction:

- **Foreground Elements**: Search input, buttons, dropdowns (hover, active,
  focus-visible)
- **Dropdown Menu Items**: State variations for menu items

## 🤖 How It Works

Each test step is described in plain English:

```typescript
await runSteps({
  page,
  userFlow: "Open dropdown menu",
  steps: [
    { description: "Click notification button to close popover" },
    { description: "Click dropdown menu button for store options" }
  ]
})
```

Passmark's AI (Claude Haiku 4.5 configured via OpenRouter) interprets these
descriptions and executes the actual browser interactions. Screenshots are
compared against baselines to detect visual regressions.

### Selector Discovery Without Writing Selectors

In the interaction tests, instead of writing CSS selectors manually, the suite:

1. **Uses Passmark to perform the interaction** (e.g., "Hover the search input
   field")
2. **Tracks what was actually hovered** via a `pointerover` event listener that
   captures `_getLastHoveredTarget`
3. **Intelligently finds the interactive element** using DOM utilities
   (`closestElement`, `isLikelyTabbable`)
4. **Generates a unique selector** for that element programmatically

This helps us eliminate brittle selectors.

## 📸 Screenshot Workflow

### Generation Mode

```bash
# Capture/update reference screenshots
npm run playwright:generate_screenshots
```

### Test Mode

```bash
# Compare against baselines and fail if visual differences detected
npm run playwright:test
```

## 🔧 Configuration

Key settings in `playwright.config.ts`:

- **AI Model**: `anthropic/claude-haiku-4.5` (via OpenRouter)
- **Headless Mode**: Auto-detected from `CI` env var
- **Viewports**: Desktop (1280×720) & Mobile (375×667)
- **Timeout**: 5 minutes per test (for AI model response)

## 📝 Notes

- CDP sessions enable forcing pseudo-states without DOM mutations
- Snapshots are stored directly in `baseline/screenshots/` without
  subdirectories
- All screenshot names follow naming conventions: `s-XX-*` (structure) & `i-*`
  (interactions)

## 🎓 Key Learnings

This suite demonstrates:

- Combining visual regression testing with AI-powered automation
- Using CDP for interaction state testing without user input
- Testing both structure and aesthetics across multiple viewports
- Natural language test descriptions for better readability

---

Built for the **[Passmark Breaking Apps Hackathon](https://hashnode.com/hackathons/breaking-things)** 🚀
