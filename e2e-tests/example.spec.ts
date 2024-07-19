import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("check title", async ({ page }) => {
  await expect(page).toHaveTitle(/mes-adresses.data.gouv.fr/);
});
