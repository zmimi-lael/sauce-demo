const { BasePage } = require('./BasePage');

class CheckoutInfoPage extends BasePage {

  constructor(page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.pageTitle = page.locator('.title');
  }

  async isLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async fillCustomerInfo(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }
}

module.exports = { CheckoutInfoPage };