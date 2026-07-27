const { BasePage } = require('./BasePage');

class CheckoutCompletePage extends BasePage {

  constructor(page) {
    super(page);

    this.pageTitle = page.locator('.title');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage = page.locator('.pony_express');
  }

  async isLoaded() {
    await this.completeHeader.waitFor({ state: 'visible' });
  }

  async getConfirmationHeader() {
    return this.completeHeader.textContent();
  }

  async getConfirmationText() {
    return this.completeText.textContent();
  }

  async backToProducts() {
    await this.backHomeButton.click();
  }
}

module.exports = { CheckoutCompletePage };