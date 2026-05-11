import { Page } from "@playwright/test"

export const addBrowserLibsInitScript = async (page: Page) => {
  await page.addInitScript(() => {
    globalThis._browserCommonLib = {
      assertIsDefined<T>(
        value: T,
        desc: string
      ): asserts value is Exclude<T, undefined | null> {
        if (value === undefined || value === null) {
          throw new Error(
            `Expected '${desc}' to be defined, got '${String(value)}'`
          )
        }
      }
    }

    globalThis._browserDOMLib = {
      isElement(value: unknown): value is Element {
        return value instanceof Element
      },

      isHTMLElement(value: unknown): value is HTMLElement {
        return value instanceof HTMLElement
      },

      assertIsElement(value: unknown, desc: string): asserts value is Element {
        if (!globalThis._browserDOMLib.isElement(value)) {
          throw new Error(`Expected '${desc}' to be an Element`)
        }
      },

      assertIsHTMLElement(
        value: unknown,
        desc: string
      ): asserts value is HTMLElement {
        if (!globalThis._browserDOMLib.isHTMLElement(value)) {
          throw new Error(`Expected '${desc}' to be an HTML element`)
        }
      },

      /**
       * Returns the element itself or the nearest ancestor that satisfies the predicate.
       */
      closestElement(
        element: Element | null,
        predicate: (element: Element) => boolean
      ): Element | null {
        let current: Element | null = element
        while (current) {
          if (predicate(current)) return current
          current = current.parentElement
        }
        return null
      },

      /**
       * Returns true if the element is likely tabbable.
       */
      isLikelyTabbable(el: Element | null): boolean {
        if (!(el instanceof HTMLElement)) return false

        // Must be visible
        const style = getComputedStyle(el)
        if (style.visibility === "hidden" || style.display === "none")
          return false

        // Anchor with href
        if (el.tagName === "A" && el.hasAttribute("href")) return true

        // Enabled form controls
        const controls = ["BUTTON", "INPUT", "SELECT", "TEXTAREA"]
        if (controls.includes(el.tagName)) return !el.hasAttribute("disabled")

        // Explicit tabindex
        return el.tabIndex >= 0
      }
    }

    globalThis._browserTestLib = {
      getUniqueSelector(el: Element) {
        if (el.getAttribute("data-testid")) {
          return `[data-testid="${el.getAttribute("data-testid")}"]`
        }

        if (el.id) {
          return `#${el.id}`
        }

        if (el.getAttribute("aria-label")) {
          return `[aria-label="${el.getAttribute("aria-label")}"]`
        }

        if (!el.hasAttribute("data-generated-testid")) {
          el.setAttribute(
            "data-generated-testid",
            `auto-generated-testid-${globalThis._getUniqueSelectorCounter++}`
          )
        }

        return `[data-generated-testid="${el.getAttribute("data-generated-testid")}"]`
      }
    }

    globalThis._getUniqueSelectorCounter = 0
  })
}

type BrowserCommonLib = {
  assertIsDefined<T>(
    value: T,
    desc: string
  ): asserts value is Exclude<T, undefined | null>
}

type BrowserDOMLib = {
  isElement(value: unknown): value is Element
  isHTMLElement(value: unknown): value is HTMLElement
  assertIsElement(value: unknown, desc: string): asserts value is Element

  assertIsHTMLElement(
    value: unknown,
    desc: string
  ): asserts value is HTMLElement

  closestElement(
    element: Element | null,
    predicate: (element: Element) => boolean
  ): Element | null

  isLikelyTabbable(el: Element | null): boolean
}

type BrowserTestLib = {
  getUniqueSelector(el: Element): string
}

declare global {
  var _browserCommonLib: BrowserCommonLib
  var _browserDOMLib: BrowserDOMLib
  var _browserTestLib: BrowserTestLib
  var _getUniqueSelectorCounter: number
}
