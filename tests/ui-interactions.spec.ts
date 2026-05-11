import { test, expect, devices, Page } from "@playwright/test"
import { runSteps } from "passmark"
import { screenshotFilename, screenshots } from "../src/baseline"
import { targetAppUrl } from "../src/env"
import { getUsableDeviceDescriptor } from "../lib/playwright"
import { addBrowserLibsInitScript } from "../browser/lib"

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
POINTER INTERACTION STATE TESTS
\*--------------------------------------------*/

/**
 * Adds an init script to track the last hovered element
 */
async function addHoverTrackingInitScript(page: Page): Promise<void> {
  await page.addInitScript(() => {
    let lastHoveredElement: EventTarget | null = null

    document.addEventListener(
      "pointerover",
      (e) => {
        lastHoveredElement = e.target
      },
      true
    )

    globalThis._getLastHoveredTarget = () => lastHoveredElement
  })
}

declare global {
  var _getLastHoveredTarget: () => EventTarget | null
}

/**
 * Gets the selector for an element by its hovered state
 */
async function getHoveredElementSelector(
  page: Page,
  name: string
): Promise<string> {
  return page.evaluate((elementName: string) => {
    const {
      _browserDOMLib: domLib,
      _browserCommonLib: commonLib,
      _browserTestLib: testLib,
      _getLastHoveredTarget
    } = globalThis as any

    const hovered = _getLastHoveredTarget()
    domLib.assertIsElement(
      hovered,
      `Last hovered after hovering ${elementName}`
    )

    const element = domLib.closestElement(hovered, domLib.isLikelyTabbable)

    commonLib.assertIsDefined(
      element,
      `Closest tabbable to last hovered after hovering ${elementName}`
    )

    return testLib.getUniqueSelector(element)
  }, name)
}

test.describe("Pointer Interactions", () => {
  test.use(getUsableDeviceDescriptor(devices["Desktop Chrome"]))
  test.beforeEach(async ({}, testInfo) => {
    testInfo.setTimeout(5 * 60_000) // 5 minutes for AI model response
  })

  test("Pointer Interaction UI Designs", async ({ page }) => {
    // Add browser libs
    await addBrowserLibsInitScript(page)

    // Add hover tracking
    await addHoverTrackingInitScript(page)

    /**
     * Start by navigating to the homepage
     */
    await runSteps({
      page,
      userFlow: "Navigate to homepage",
      steps: [{ description: `Navigate to ${targetAppUrl}` }]
    })

    /**
     * Foreground element 1: Search input
     */
    await runSteps({
      page,
      userFlow: "Hover search input",
      steps: [{ description: "Hover the search input field" }]
    })

    const inputSelector = await getHoveredElementSelector(page, "search input")

    /**
     * Foreground element 2: Notifications button
     */
    await runSteps({
      page,
      userFlow: "Hover notifications button",
      steps: [{ description: "Hover the notifications button" }]
    })

    const popoverButtonSelector = await getHoveredElementSelector(
      page,
      "notifications button"
    )

    /**
     * Foreground element 3: Dropdown button
     */
    await runSteps({
      page,
      userFlow: "Hover dropdown menu button",
      steps: [{ description: "Hover the dropdown menu button" }]
    })

    const dropdownButtonSelector = await getHoveredElementSelector(
      page,
      "dropdown menu button"
    )

    /**
     * Foreground element 4: Select plan button
     */
    await runSteps({
      page,
      userFlow: "Hover select plan button",
      steps: [{ description: "Hover the select plan button" }]
    })

    const selectPlanButtonSelector = await getHoveredElementSelector(
      page,
      "select plan button"
    )

    /**
     * Foreground element 5: Collapse setup guide button
     */
    await runSteps({
      page,
      userFlow: "Hover over collapse setup guide button",
      steps: [
        { description: "Hover the button that collapses the setup guide" }
      ]
    })

    const collapseSetupGuideButtonSelector = await getHoveredElementSelector(
      page,
      "collapse setup guide button"
    )

    /**
     * Foreground element 6: Add product button
     */
    await runSteps({
      page,
      userFlow: "Hover the add product button",
      steps: [
        { description: "Click Add your first product button to expand" },
        { description: "Hover the add product button beside import product" }
      ]
    })

    const addProductButtonSelector = await getHoveredElementSelector(
      page,
      "add product button"
    )

    /**
     * Foreground element 7: Import product button
     */
    await runSteps({
      page,
      userFlow: "Hover the import product button",
      steps: [
        // Second accordion item already expanded here
        { description: "Hover the import product button beside add product" }
      ]
    })

    const importProductButtonSelector = await getHoveredElementSelector(
      page,
      "import product button"
    )

    /**
     *
     *
     *
     *
     *
     *
     *
     *
     *
     * Screenshot comparison / image generation
     */

    // Reset mouse position
    await page.mouse.move(0, 0)

    // Prepare CDP Session
    const client = await page.context().newCDPSession(page)
    await client.send("DOM.enable")
    await client.send("CSS.enable")
    const { root } = await client.send("DOM.getDocument")

    const { nodeIds } = await client.send("DOM.querySelectorAll", {
      nodeId: root.nodeId,
      selector: [
        inputSelector,
        popoverButtonSelector,
        dropdownButtonSelector,
        selectPlanButtonSelector,
        collapseSetupGuideButtonSelector,
        addProductButtonSelector,
        importProductButtonSelector
      ].join(", ")
    })

    /**
     * Generate screenshots for foreground elements. Use `null` state to clear
     */
    for (const state of ["hover", "active", "focus-visible", null] as const) {
      await Promise.all(
        nodeIds.map((nodeId) =>
          client.send("CSS.forcePseudoState", {
            nodeId,
            forcedPseudoClasses: state ? [state] : []
          })
        )
      )
      if (state) {
        await page.mouse.move(-1, -1) // Move cursor off-screen
        await expect(page).toHaveScreenshot(
          screenshotFilename({
            screenshot: screenshots.interactions.foregroundElements,
            interaction: state
          })
        )
      }
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
     *
     * Dropdown menu item screenshot comparison / generation
     */

    await runSteps({
      page,
      userFlow: "Hover second dropdown menu item",
      steps: [
        { description: "Click the dropdown menu button for store options" },
        { description: "Hover the second dropdown menu item" }
      ]
    })

    const dropdownItem2Selector = await getHoveredElementSelector(
      page,
      "second dropdown menu item"
    )

    const { nodeId } = await client.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: dropdownItem2Selector
    })

    /**
     * Generate screenshots for dropdown menu item
     */
    for (const state of ["hover", "active", "focus-visible"] as const) {
      await client.send("CSS.forcePseudoState", {
        nodeId,
        forcedPseudoClasses: [state]
      })
      await page.mouse.move(-1, -1) // Move cursor off-screen
      await expect(page).toHaveScreenshot(
        screenshotFilename({
          screenshot: screenshots.interactions.dropdownMenuItem,
          interaction: state
        })
      )
    }
  })
})
