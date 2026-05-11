import { devices } from "@playwright/test"

/**
 * `defaultBrowserType` must be removed from device descriptor for test.use()
 * because including it causes Playwright to throw an error when supplied in the
 * describe() group:
 *
 * > Cannot use({ defaultBrowserType }) in a describe group, because it forces a
 * > new worker. Make it top-level in the test file or put in the configuration
 * > file.
 */
export function getUsableDeviceDescriptor(dd: (typeof devices)[string]) {
  const { defaultBrowserType: _, ...rest } = dd
  return rest
}
