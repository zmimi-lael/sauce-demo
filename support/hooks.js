const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

BeforeAll(async function () {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
});

Before(async function ({ pickle }) {
  const tags = pickle.tags.map((t) => t.name);
  const isApiOnly = tags.includes('@api');

  // Always create API request context (cheap, useful for hybrid tests too)
  await this.initRequest();

  // Only launch browser for UI scenarios
  if (!isApiOnly) {
    await this.initBrowser();
  }
});

After(async function (scenario) {
  const tags = scenario.pickle.tags.map((t) => t.name);
  const isApiOnly = tags.includes('@api');

  // Screenshot only for UI failures
  if (!isApiOnly && scenario.result?.status === Status.FAILED && this.page) {
    const screenshotPath = path.resolve(
      __dirname,
      `../reports/screenshot-${Date.now()}.png`
    );
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    const buffer = fs.readFileSync(screenshotPath);
    await this.attach(buffer, 'image/png');
  }

  await this.closeBrowser();
  await this.closeRequest();
});

AfterAll(async function () {
  // Cleanup if needed
});