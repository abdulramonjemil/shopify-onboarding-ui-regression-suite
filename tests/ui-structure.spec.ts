import { test, expect, devices } from "@playwright/test"
import { runSteps } from "passmark"
import { screenshotFilename, screenshots } from "../src/baseline"
import { targetAppUrl } from "../src/env"
import { getUsableDeviceDescriptor } from "../lib/playwright"

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

const windows = [
  {
    title: "Desktop",
    screen: "desktop",
    fixtures: {
      ...getUsableDeviceDescriptor(devices["Desktop Chrome"]),
      viewport: { width: 1280, height: 720 }
    }
  },
  {
    title: "Mobile",
    screen: "mobile",
    fixtures: {
      ...getUsableDeviceDescriptor(devices["Pixel 5"]),
      viewport: { width: 375, height: 667 }
    }
  }
] as const

for (const win of windows) {
  test.describe(`${win.title} Viewport`, () => {
    test.use(win.fixtures)

    test.beforeEach(async ({}, testInfo) => {
      testInfo.setTimeout(5 * 60_000) // 5 minutes for AI model response
    })

    test(`${win.title} UI Structure`, async ({ page }) => {
      /**
       * Step 1: Default homepage state
       */
      await runSteps({
        page,
        userFlow: "Navigate to homepage",
        steps: [{ description: `Navigate to ${targetAppUrl}` }]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.homepage,
          screen: win.screen
        })
      )

      /**
       * Step 2: Open popover
       */
      await runSteps({
        page,
        userFlow: "Open notifications",
        steps: [{ description: "Click notification button" }]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.popover,
          screen: win.screen
        })
      )

      /**
       * Step 3: Close popover and open dropdown
       */
      await runSteps({
        page,
        userFlow: "Open dropdown menu",
        steps: [
          { description: "Click notification button to close popover" },
          { description: "Click dropdown menu button for store options" }
        ]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.dropdown,
          screen: win.screen
        })
      )

      /**
       * Step 4: Close dropdown and dismiss trial offer
       */
      await runSteps({
        page,
        userFlow: "Dismiss trial offer",
        steps: [
          { description: "Click dropdown menu button to close dropdown" },
          { description: "Dismiss trial offer" },
          { description: "Click on body to stabilize focus" }
        ]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.dismissedTrialOffer,
          screen: win.screen
        })
      )

      /**
       * Step 5: Check first checkbox (20% progress)
       */
      await runSteps({
        page,
        userFlow: "Reach 20 percent progress",
        steps: [{ description: "Check first checkbox" }]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.progress20Percent,
          screen: win.screen
        })
      )

      /**
       * Step 6: Check remaining checkboxes (100% progress)
       */
      await runSteps({
        page,
        userFlow: "Reach 100 percent progress",
        steps: [
          { description: "Check second checkbox" },
          { description: "Check third checkbox" },
          { description: "Check fourth checkbox" },
          { description: "Check fifth checkbox" }
        ]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.progress100Percent,
          screen: win.screen
        })
      )

      /**
       * Step 7: Open accordion item 1
       */
      await runSteps({
        page,
        userFlow: "Open accordion item 1",
        steps: [
          { description: "Click Customize your online store button to expand" }
        ]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem1,
          screen: win.screen
        })
      )

      /**
       * Step 8: Open accordion item 2 (closes item 1)
       */
      await runSteps({
        page,
        userFlow: "Open accordion item 2",
        steps: [
          { description: "Click Add your first product button to expand" }
        ]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem2,
          screen: win.screen
        })
      )

      /**
       * Step 9: Open accordion item 3 (closes item 2)
       */
      await runSteps({
        page,
        userFlow: "Open accordion item 3",
        steps: [{ description: "Click Add a custom domain button to expand" }]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem3,
          screen: win.screen
        })
      )

      /**
       * Step 10: Open accordion item 4 (closes item 3)
       */
      await runSteps({
        page,
        userFlow: "Open accordion item 4",
        steps: [{ description: "Click Name your store button to expand" }]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem4,
          screen: win.screen
        })
      )

      /**
       * Step 11: Open accordion item 5 (closes item 4)
       */
      await runSteps({
        page,
        userFlow: "Open accordion item 5",
        steps: [
          { description: "Click Set up a payment provider button to expand" }
        ]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page.getByRole("main")).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.accordionItem5,
          screen: win.screen
        })
      )

      /**
       * Step 12: Collapse main section
       */
      await runSteps({
        page,
        userFlow: "Collapse setup guide",
        steps: [
          { description: "Click button to collapse setup guide" },
          { description: "Click on body to stabilize focus" }
        ]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.structure.collapsedMainSection,
          screen: win.screen
        })
      )
    })
  })
}
