import { test, expect } from "@playwright/test"
import { runSteps } from "passmark"
import { targetAppUrl } from "../src/env"

/**
 * Screenshot filenames for UI design regression testing.
 */
const screenshots = {
  structure: {
    homepage: "s-01-homepage",
    popover: "s-02-popover",
    dropdown: "s-03-dropdown",
    dismissedTrialOffer: "s-04-dismissed-trial-offer",
    progress20Percent: "s-05-progress-20-percent",
    progress100Percent: "s-06-progress-100-percent",
    accordionItem1: "s-07-accordion-item-1",
    accordionItem2: "s-08-accordion-item-2",
    accordionItem3: "s-09-accordion-item-3",
    accordionItem4: "s-10-accordion-item-4",
    accordionItem5: "s-11-accordion-item-5",
    collapsedMainSection: "s-12-collapsed-main-section"
  }
} as const

type StructureScreenshotValue =
  (typeof screenshots.structure)[keyof typeof screenshots.structure]

function screenshotFilename({
  screenshot,
  screen
}: {
  screenshot: StructureScreenshotValue
  screen: "desktop" | "mobile"
}) {
  return `${screenshot}.${screen}.png`
}

test.describe("Desktop UI Structure", () => {
  test.use({
    viewport: { width: 1280, height: 720 } // Desktop viewport
  })

  test.beforeEach(async (_, testInfo) => {
    testInfo.setTimeout(120_000) // 2 minutes for AI model response
  })

  test("Default homepage state", async ({ page }) => {
    // Load the homepage and capture the default state
    await runSteps({
      page,
      userFlow: "Load homepage",
      steps: [{ description: `Navigate to ${targetAppUrl}` }]
    })

    // Capture full page screenshot
    await expect(page).toHaveScreenshot(
      screenshotFilename({
        screenshot: screenshots.structure.homepage,
        screen: "desktop"
      })
    )
  })
})
