import { defineConfig, devices } from "@playwright/test";

// Localmente usa o Chrome instalado (sem baixar navegador); no CI, o Chromium do Playwright.
const local = !process.env.CI;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    // navegador em português: a página em português abre sem o aviso de idioma nos testes
    locale: "pt-BR",
    acceptDownloads: true,
    ...(local ? { channel: "chrome" } : {})
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], ...(local ? { channel: "chrome" } : {}) },
      grepInvert: /@mobile/
    },
    { name: "celular", use: { ...devices["Pixel 7"], ...(local ? { channel: "chrome" } : {}) }, grep: /@mobile/ }
  ],
  webServer: {
    command: "npx http-server . -p 4173 -c-1 --silent",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: local
  }
});
