import { test, expect, devices } from "@playwright/test"
import { runSteps } from "passmark"
import { targetAppUrl } from "../src/env"

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

/*--------------------------------------------*\
CONSTANTS AND HELPERS
\*--------------------------------------------*/

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
  return `${screenshot}--${screen}.png`
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

/*--------------------------------------------*\
TEST CONFIG
\*--------------------------------------------*/

test.use({
  headless: !!process.env.CI
})

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

/*--------------------------------------------*\
UI STRUCTURE TESTS
\*--------------------------------------------*/

/**
 * `defaultBrowserType` must be removed because including it causing Playwright
 * to throw an error when supplied in the describe() group:
 *
 * > Cannot use({ defaultBrowserType }) in a describe group, because it forces a
 * > new worker. Make it top-level in the test file or put in the configuration
 * > file.
 */
const { defaultBrowserType: _, ...desktopVPConfig } = devices["Desktop Chrome"]
const { defaultBrowserType: __, ...mobileVPConfig } = devices["Pixel 5"]

const viewports = [
  {
    name: "Desktop",
    screen: "desktop",
    fixtures: {
      ...desktopVPConfig,
      viewport: { width: 1280, height: 720 }
    }
  },
  {
    name: "Mobile",
    screen: "mobile",
    fixtures: {
      ...mobileVPConfig, // For Android Chrome
      viewport: { width: 375, height: 667 }
    }
  }
] as const

for (const vp of viewports) {
  test.describe(`${vp.name} Viewport`, () => {
    test.use(vp.fixtures)

    test.beforeEach(async ({}, testInfo) => {
      testInfo.setTimeout(5 * 60_000) // 5 minutes for AI model response
    })

    test(`${vp.name} UI Structure`, async ({ page }) => {
      /**
       * Step 1: Default homepage state
       */
      await runSteps({
        page,
        userFlow: "Homepage",
        steps: [{ description: `Navigate to ${targetAppUrl}` }]
      })
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.homepage,
          screen: vp.screen
        })
      )

      /**
       * Step 2: Open popover
       */
      await runSteps({
        page,
        userFlow: "Popover",
        steps: [{ description: "Click notification button" }]
      })
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.popover,
          screen: vp.screen
        })
      )

      /**
       * Step 3: Close popover and open dropdown
       */
      await runSteps({
        page,
        userFlow: "Dropdown",
        steps: [
          { description: "Click notification button to close popover" },
          { description: "Click dropdown menu button" }
        ]
      })
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.dropdown,
          screen: vp.screen
        })
      )

      /**
       * Step 4: Close dropdown and dismiss trial offer
       */
      await runSteps({
        page,
        userFlow: "Dismissed Trial Offer",
        steps: [
          { description: "Click dropdown menu button to close dropdown" },
          { description: "Dismiss trial offer" },
          { description: "Click on body to stabilize focus" }
        ]
      })
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.dismissedTrialOffer,
          screen: vp.screen
        })
      )

      /**
       * Step 5: Check first checkbox (20% progress)
       */
      await runSteps({
        page,
        userFlow: "Progress 20%",
        steps: [{ description: "Check first checkbox" }]
      })
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.progress20Percent,
          screen: vp.screen
        })
      )

      /**
       * Step 6: Check remaining checkboxes (100% progress)
       */
      await runSteps({
        page,
        userFlow: "Check remaining checkboxes",
        steps: [
          { description: "Check second checkbox" },
          { description: "Check third checkbox" },
          { description: "Check fourth checkbox" },
          { description: "Check fifth checkbox" }
        ]
      })
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.progress100Percent,
          screen: vp.screen
        })
      )

      /**
       * Step 7: Open accordion item 1
       */
      await runSteps({
        page,
        userFlow: "Accordion Item 1",
        steps: [
          { description: "Click Customize your online store button to expand" }
        ]
      })
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem1,
          screen: vp.screen
        })
      )

      /**
       * Step 8: Open accordion item 2 (closes item 1)
       */
      await runSteps({
        page,
        userFlow: "Accordion Item 2",
        steps: [
          { description: "Click Add your first product button to expand" }
        ]
      })
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem2,
          screen: vp.screen
        })
      )

      /**
       * Step 9: Open accordion item 3 (closes item 2)
       */
      await runSteps({
        page,
        userFlow: "Accordion Item 3",
        steps: [{ description: "Click Add a custom domain button to expand" }]
      })
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem3,
          screen: vp.screen
        })
      )

      /**
       * Step 10: Open accordion item 4 (closes item 3)
       */
      await runSteps({
        page,
        userFlow: "Accordion Item 4",
        steps: [{ description: "Click Name your store button to expand" }]
      })
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem4,
          screen: vp.screen
        })
      )

      /**
       * Step 11: Open accordion item 5 (closes item 4)
       */
      await runSteps({
        page,
        userFlow: "Accordion Item 5",
        steps: [
          { description: "Click Set up a payment provider button to expand" }
        ]
      })
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem5,
          screen: vp.screen
        })
      )

      /**
       * Step 12: Collapse main section
       */
      await runSteps({
        page,
        userFlow: "Collapsed Main Section",
        steps: [
          { description: "Click button to collapse setup guide" },
          { description: "Click on body to stabilize focus" }
        ]
      })
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.collapsedMainSection,
          screen: vp.screen
        })
      )
    })
  })
}
