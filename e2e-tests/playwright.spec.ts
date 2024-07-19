import { test, expect } from "@playwright/test";

let balId = null;
let balToken = null;

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("check title", async ({ page }) => {
    await expect(page).toHaveTitle(/mes-adresses.data.gouv.fr/);
  });

  test("create a new BAL", async ({ page }) => {
    await page
      .getByRole("link", { name: "Créer une Base Adresse Locale" })
      .click();
    await page.getByPlaceholder("Roche").fill("cangey");
    await page
      .getByRole("option", { name: "Cangey (Indre-et-Loire - 37)" })
      .locator("div")
      .first()
      .click();
    await page
      .getByPlaceholder("nom@example.com")
      .fill("gfay@e2e-tests-bal.fr");
    await page
      .getByRole("button", { name: "Créer la Base Adresse Locale" })
      .click();
    await page.getByRole("button", { name: "Continuer" }).click();

    await page.waitForURL(/\/bal\/.+/);

    const balAccessStr = await page.evaluate(() =>
      localStorage.getItem("bal-access")
    );
    balToken = balAccessStr;
    const balAccess = JSON.parse(balAccessStr);
    balId = Object.keys(balAccess)[0];
    balToken = balAccess[balId];
    console.log("balId", balId);
    console.log("balToken", balToken);

    expect(balId).not.toBeNull();
    expect(balToken).not.toBeNull();
  });
});

test.describe("BAL page - Edition", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/bal/${balId}/${balToken}`);

    await page.getByRole("button", { name: "Commencer l'adressage" }).click();
  });

  test("create a new voie", async ({ page }) => {
    await page.getByRole("button", { name: "Ajouter une voie" }).click();
    await page.getByPlaceholder("Nom de la voie").fill("Rue de la Mairie");
    await page.getByRole("button", { name: "Enregistrer" }).click();

    await page.waitForSelector("text^=Rue de la Mairie");
  });

  // test("Create a new toponyme", async ({ page }) => {
  //   await page.waitForSelector("text^=Adresses de Cangey")
  // });
});

test.describe("BAL page - Read only", () => {
  test.beforeEach(async ({ page }) => {
    // const balId = getBALId();
    await page.goto(`/bal/${balId}/invalid_token`);
  });

  // test("check that new BAL is in list", async ({ page }) => {
  //   await page.waitForSelector("text^=Adresses de Cangey");
  // });

  // test("check that new BAL is in list", async ({ page }) => {
  //   await page.waitForSelector("text^=Adresses de Cangey");
  // });
});
