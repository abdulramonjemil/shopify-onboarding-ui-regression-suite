import { test, expect } from "@playwright/test"
import { runSteps } from "passmark"

test.use({
  headless: !!process.env.CI
})

test("Shopping cart tests", async ({ page }) => {
  test.setTimeout(180_000) // increase timeout for AI execution
  await runSteps({
    page,
    userFlow: "Add product to cart",
    steps: [
      { description: "Navigate to https://demo.vercel.store" },
      { description: "Click Acme Circles T-Shirt" },
      { description: "Select color", data: { value: "White" } },
      { description: "Select size", data: { value: "S" } },
      { description: "Add to cart", waitUntil: "My Cart is visible" }
    ],
    assertions: [
      { assertion: "You can see My Cart with Acme Circles T-Shirt" }
    ],
    test,
    expect
  })
})

/*
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
*/
