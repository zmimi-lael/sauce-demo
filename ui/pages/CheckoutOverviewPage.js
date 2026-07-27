const { BasePage } = require('./BasePage');

class CheckoutOverviewPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async isLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.finishButton.waitFor({ state: 'visible' });
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async getItemNames() {
    return this.itemNames.allTextContents();
  }

  async finish() {
    await this.finishButton.click();
  }
}

module.exports = { CheckoutOverviewPage };