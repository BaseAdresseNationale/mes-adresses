import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

let balId = null;
let balToken = null;

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("check accessibility", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("new page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new");
  });

  test("check accessibility", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("create a new BAL", async ({ page }) => {
    await page
      .getByRole("searchbox", { name: "Rechercher une commune *" })
      .fill("limeray");
    await page.getByText("Limeray (Indre-et-Loire - 37)").click();
    await page.getByRole("button", { name: "Créer une nouvelle Base" }).click();
    await page.getByText("Partir des données existantes").click();
    await page.getByRole("button", { name: "Suivant" }).click();
    await page.getByRole("textbox", { name: "Adresse email de l'" }).click();
    await page
      .getByRole("textbox", { name: "Adresse email de l'" })
      .fill("test@playwright.com");
    await page.getByRole("button", { name: "Terminer" }).click();

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
  });

  test("create a new voie", async ({ page }) => {
    await page.getByRole("button", { name: "Commencez l’adressage" }).click();
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet voies.*/ })
      .click();

    await page.getByRole("link", { name: "Ajouter une voie" }).click();
    await page
      .getByRole("textbox", { name: "Nom de la voie *" })
      .fill("Rue de la Fontenelle");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForURL(/\/bal\/[a-f\d]{24}\/voies\/[a-f\d]{24}\/numeros/i);
  });

  // test("Create a new toponyme", async ({ page }) => {
  //   await page.waitForSelector("text^=Adresses de Cangey")
  // });
});

/* test.describe("BAL page - Read only", () => {
  test.beforeEach(async ({ page }) => { */
// const balId = getBALId();
/*     await page.goto(`/bal/${balId}/invalid_token`);
  }); */

// test("check that new BAL is in list", async ({ page }) => {
//   await page.waitForSelector("text^=Adresses de Cangey");
// });

// test("check that new BAL is in list", async ({ page }) => {
//   await page.waitForSelector("text^=Adresses de Cangey");
// });
/* });
 */
