import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

let balId = null;
let balToken = null;
let voieId = null;
let toponymeId = null;

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Check accessibility", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe("New page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/new");
  });

  test("Check accessibility", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Create a new BAL", async ({ page }) => {
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

    expect(balId).not.toBeNull();
    expect(balToken).not.toBeNull();
  });
});

test.describe("BAL page - Edition", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/bal/${balId}/${balToken}`);
    await page.getByRole("button", { name: "Commencez l’adressage" }).click();
  });

  test("Check accessibility commune tab", async ({ page }) => {
    await page.goto(`/bal/${balId}`);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Check accessibility voie tab", async ({ page }) => {
    await page.goto(`/bal/${balId}/voies`);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Check accessibility toponyme tab", async ({ page }) => {
    await page.goto(`/bal/${balId}/toponymes`);
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Create a new voie", async ({ page }) => {
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet voies.*/ })
      .click();

    await page.getByRole("link", { name: "Ajouter une voie" }).click();
    await page
      .getByRole("textbox", { name: "Nom de la voie *" })
      .fill("Rue de la Fontenelle");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForURL(/\/bal\/[a-f\d]{24}\/voies\/[a-f\d]{24}\/numeros/i);
    voieId = await page.url().split("/")[6];

    expect(voieId).not.toBeNull();
  });

  test("Edit voie", async ({ page }) => {
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet voies.*/ })
      .click();
    await page
      .getByRole("textbox", { name: "Rechercher une voie, une" })
      .fill("Rue de la fontenelle");
    await page
      .locator("div")
      .filter({ hasText: /^Rue de la Fontenelle$/ })
      .nth(2)
      .click();
    await page.getByRole("link", { name: "Éditer la voie" }).click();
    await page
      .getByRole("textbox", { name: "Nom de la voie *" })
      .fill("Rue des Champs");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForSelector('text="La voie a bien été modifiée"');
    await page.waitForSelector('h2:has-text("Liste des numéros")');

    expect(
      await page
        .locator("div")
        .filter({ hasText: /^Rue des Champs$/ })
        .count()
    ).toBeGreaterThan(0);
  });

  /*   test("Check voie form accessibility", async ({ page }) => {
    await page.goto(`/bal/${balId}/voies/${voieId}`);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  }); */

  test("Create a numéro on voie", async ({ page }) => {
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet voies.*/ })
      .click();
    await page
      .getByRole("textbox", { name: "Rechercher une voie, une" })
      .fill("Rue des Champs");
    await page
      .locator("div")
      .filter({ hasText: /^Rue des Champs$/ })
      .nth(2)
      .click();
    await page.getByRole("button", { name: "Ajouter un numéro" }).click();
    await page.getByRole("spinbutton", { name: "Numéro *" }).fill("2");
    await page.getByPlaceholder("Suffixe").fill("bis");
    await page
      .getByRole("button", { name: "Certifier et enregistrer" })
      .click();
    await page.waitForSelector('text="Le numéro a bien été ajouté"');
    await page.waitForTimeout(1000); // Wait for the numéro to appear in the list

    expect(
      await page
        .locator("span")
        .filter({ hasText: /^2 bis$/ })
        .count()
    ).toBeGreaterThan(0);
  });

  /*   test("Check numéro form accessibility", async ({ page }) => {
    await page.goto(`/bal/${balId}/voies/${voieId}/numeros`);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  }); */

  test("Delete voie", async ({ page }) => {
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet voies.*/ })
      .click();
    await page
      .getByRole("textbox", { name: "Rechercher une voie, une" })
      .fill("Rue des Champs");
    await page.waitForSelector('div:has-text("Rue des Champs")');
    await page.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Supprimer…" }).click();
    await page.getByRole("button", { name: "Supprimer" }).click();
    await page.waitForSelector('text="La voie a bien été archivée"');
    await page.waitForTimeout(1000);

    expect(
      await page
        .locator("div")
        .filter({ hasText: /^Rue des champs$/ })
        .count()
    ).toBe(0);
  });

  test("Create a new toponyme", async ({ page }) => {
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet toponymes.*/ })
      .click();
    await page.getByRole("link", { name: "Ajouter un toponyme" }).click();
    await page
      .getByRole("textbox", { name: "Nom du toponyme *" })
      .fill("Le petit lieu");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForSelector('text="Le toponyme a bien été ajouté"');
    await page.waitForTimeout(1000);

    await page.waitForURL(
      /\/bal\/[a-f\d]{24}\/toponymes\/[a-f\d]{24}\/numeros/i
    );
    toponymeId = await page.url().split("/")[6];

    expect(toponymeId).not.toBeNull();
  });

  test("Edit toponyme", async ({ page }) => {
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet toponymes.*/ })
      .click();
    await page
      .getByRole("textbox", { name: "Rechercher un toponyme" })
      .fill("Le petit lieu");
    await page
      .locator("div")
      .filter({ hasText: /^Le petit lieu$/ })
      .nth(2)
      .click();
    await page.getByRole("link", { name: "Éditer le toponyme" }).click();
    await page
      .getByRole("textbox", { name: "Nom du toponyme *" })
      .fill("Le grand lieu");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForSelector('text="Le toponyme a bien été modifié"');
    await page.waitForTimeout(1000);

    expect(
      await page
        .locator("div")
        .filter({ hasText: /^Le grand lieu$/ })
        .count()
    ).toBeGreaterThan(0);
  });

  /*   test("Check toponyme form accessibility", async ({ page }) => {
    await page.goto(`/bal/${balId}/toponymes/${toponymeId}`);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  }); */

  test("Delete toponyme", async ({ page }) => {
    await page
      .getByRole("tab", { name: /Illustration de l\'onglet toponymes.*/ })
      .click();
    await page
      .getByRole("textbox", { name: "Rechercher un toponyme" })
      .fill("Le grand lieu");
    await page.waitForSelector('div:has-text("Le grand lieu")');
    await page.getByRole("button", { name: "Actions" }).click();
    await page.getByRole("menuitem", { name: "Supprimer…" }).click();
    await page.getByRole("button", { name: "Supprimer" }).click();
    await page.waitForSelector('text="Le toponyme a bien été archivé"');
    await page.waitForTimeout(1000);

    expect(
      await page
        .locator("div")
        .filter({ hasText: /^Le grand lieu$/ })
        .count()
    ).toBe(0);
  });
});

test.describe("BAL page - Publication", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/bal/${balId}/${balToken}`);
  });
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
