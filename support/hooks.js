const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');

BeforeAll(async function () {
  // Ensure reports directory exists
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
});

Before(async function () {
  await this.initBrowser();
});

After(async function (scenario) {
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshotPath = path.resolve(
      __dirname,
      `../reports/screenshot-${Date.now()}.png`
    );
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    // Attach to Cucumber report
    const buffer = fs.readFileSync(screenshotPath);
    await this.attach(buffer, 'image/png');
  }

  await this.closeBrowser();
});

AfterAll(async function () {
  // Cleanup if needed
});