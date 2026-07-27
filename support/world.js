const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const { loadEnvironment } = require('./env');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.env = loadEnvironment();
  }

  async initBrowser() {
    const headed = process.env.HEADED === 'true';
    const slowMo = process.env.DEBUG === 'true' ? 250 : 0;

    this.browser = await chromium.launch({
      headless: !headed,
      slowMo,
    });

    this.context = await this.browser.newContext({
      baseURL: this.env.baseURL, // Access base URL from the loaded environment
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });

    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);