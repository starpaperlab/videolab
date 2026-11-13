import { test, expect } from "@playwright/test";
test("brand and project lifecycle persists; editor metadata and filters work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Hagamos algo extraordinario." }),
  ).toBeVisible();
  await page.goto("/marcas");
  await page.getByRole("button", { name: "Añadir marca", exact: true }).click();
  await page.getByLabel("Nombre de la marca").fill("Aurora Test");
  await page
    .getByLabel("Descripción", { exact: true })
    .fill("Una marca creada durante la prueba.");
  await page.getByLabel("Público objetivo").fill("Creadores");
  await page.getByLabel("Tono de comunicación").fill("Cercano");
  await page.getByLabel("Instagram", { exact: true }).check();
  await page.getByRole("button", { name: "Guardar marca" }).click();
  await expect(
    page.getByRole("heading", { name: "Aurora Test" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Aurora Test" }),
  ).toBeVisible();
  await page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Aurora Test" }) })
    .getByRole("button", { name: "Administrar marca" })
    .click();
  await expect(page.getByLabel("Público objetivo")).toHaveValue("Creadores");
  await page.getByLabel("Tono de comunicación").fill("Inspirador");
  await page.getByRole("button", { name: "Guardar marca" }).click();
  await page.goto("/proyectos");
  await page
    .getByRole("button", { name: "Nuevo proyecto", exact: true })
    .click();
  await page.getByLabel("Nombre del proyecto").fill("Historia Aurora");
  await page
    .getByRole("combobox", { name: "Marca", exact: true })
    .selectOption({ label: "Aurora Test" });
  await page
    .getByRole("combobox", { name: "Formato", exact: true })
    .selectOption("16:9");
  await page
    .getByRole("button", { name: "Crear proyecto", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Historia Aurora" }),
  ).toBeVisible();
  await page
    .getByLabel("Filtrar por marca")
    .selectOption({ label: "Aurora Test" });
  await expect(page.getByRole("article")).toHaveCount(1);
  await page
    .getByRole("link", { name: "Abrir Historia Aurora en el editor" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Historia Aurora" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Exportar · Próximamente" }),
  ).toBeDisabled();
  await page.getByLabel("Nombre", { exact: true }).fill("Historia actualizada");
  await page.getByRole("combobox", { name: "Estado", exact: true }).focus();
  await page
    .getByRole("combobox", { name: "Estado", exact: true })
    .selectOption("En progreso");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Historia actualizada" }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Estado", exact: true }),
  ).toHaveValue("En progreso");
  await page.goto("/proyectos");
  await page.getByLabel("Buscar proyectos").fill("no existe");
  await expect(
    page.getByRole("heading", { name: "Ningún proyecto por aquí" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("all routes, responsive layout and honest placeholders", async ({
  page,
}) => {
  for (const route of [
    "",
    "proyectos",
    "editor",
    "biblioteca",
    "marcas",
    "calendario",
    "automatizaciones",
    "configuracion",
  ]) {
    const response = await page.goto("/" + route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await page.screenshot({
    path: `test-results/dashboard-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Nuevo proyecto", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goto("/no-existe");
  expect(
    await page
      .getByRole("heading", { name: "Esta página no está en el estudio" })
      .count(),
  ).toBe(1);
});
test("corrupt local data reports an error and recovers with examples", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("videolab.workspace.v1", '{"invalid":true}'),
  );
  await page.reload();
  await expect(
    page.getByRole("alert").filter({ hasText: "No pudimos leer" }),
  ).toContainText("No pudimos leer los datos locales");
  await expect(
    page.getByRole("heading", { name: "Hagamos algo extraordinario." }),
  ).toBeVisible();
});
