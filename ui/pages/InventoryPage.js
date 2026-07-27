const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {

  constructor(page) {
    super(page);

    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.pageTitle = page.locator('.title');
  }

  async isLoaded() {
    await this.inventoryContainer.waitFor({ state: 'visible' });
    return true;
  }

  async getItemCount() {
    return this.inventoryItems.count();
  }

  async addItemToCartByName(itemName) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.locator('button').click();
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}

module.exports = { InventoryPage };