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
SCREENSHOTS
\*--------------------------------------------*/

/**
 * Screenshot filenames bases
 */
export const screenshots = {
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
  },

  interactions: {
    foregroundElements: "i-foreground-elements",
    dropdownMenuItem: "i-dropdown-menu-item"
  }
} as const

export type StructureScreenshot =
  (typeof screenshots.structure)[keyof typeof screenshots.structure]
export type InteractionScreenshot =
  (typeof screenshots.interactions)[keyof typeof screenshots.interactions]

export type ScreenshotFilenameConfig =
  | {
      screenshot: StructureScreenshot
      screen: "desktop" | "mobile"
      interaction?: undefined
    }
  | {
      screenshot: InteractionScreenshot
      interaction: "hover" | "active" | "focus-visible"
      screen?: undefined
    }

export function screenshotFilename(config: ScreenshotFilenameConfig) {
  if (config.screen) {
    return `${config.screenshot}--${config.screen}.png`
  } else {
    return `${config.screenshot}--${config.interaction}.png`
  }
}
