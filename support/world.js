const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium, request } = require('@playwright/test');
const { loadEnvironment } = require('./env');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.request = null; // Playwright APIRequestContext for API tests
    this.env = loadEnvironment();
  }

  async initRequest() {
    // Playwright APIRequestContext – used for all API tests (no axios/fetch)
    this.request = await request.newContext({
      baseURL: this.env.apiBaseURL,
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });
  }

  async initBrowser() {
    const headed = process.env.HEADED === 'true';
    const slowMo = process.env.DEBUG === 'true' ? 250 : 0;

    this.browser = await chromium.launch({
      headless: !headed,
      slowMo,
    });

    this.context = await this.browser.newContext({
      baseURL: this.env.baseURL,
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });

    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    if (this.page) await this.page.close().catch(() => {});
    if (this.context) await this.context.close().catch(() => {});
    if (this.browser) await this.browser.close().catch(() => {});
    this.page = null;
    this.context = null;
    this.browser = null;
  }

  async closeRequest() {
    if (this.request) {
      await this.request.dispose().catch(() => {});
      this.request = null;
    }
  }
}

setWorldConstructor(CustomWorld);