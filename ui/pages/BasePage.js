/**
 * Base Page Object – common navigation & utility methods
 */
class BasePage {

  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle() {
    return this.page.title();
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `reports/${name}.png`, fullPage: true });
  }
}

module.exports = { BasePage };