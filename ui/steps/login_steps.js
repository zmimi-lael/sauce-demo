const { Given, When, Then } = require('@cucumber/cucumber');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const {
  assertVisible,
  assertUrlContains,
  assertTextContains,
  assertElementCount,
} = require('../../utils/assertions');

Given('I am on the login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.open();
  await assertVisible(this.loginPage.loginLogo, 'Login logo should be visible');
});

When('I login with valid credentials', async function () {
  await this.loginPage.loginAsStandardUser(this.env);
});

When('I login with username {string} and password {string}', async function (username, password) {
  await this.loginPage.login(username, password);
});

Then('I should be redirected to the inventory page', async function () {
  this.inventoryPage = new InventoryPage(this.page);
  await this.inventoryPage.isLoaded();
  await assertUrlContains(this.page, 'inventory.html');
  await assertVisible(this.inventoryPage.pageTitle, 'Inventory title should be visible');
});

Then('the inventory should contain products', async function () {
  const count = await this.inventoryPage.getItemCount();
  if (count < 1) {
    throw new Error(`Expected at least 1 product, but found ${count}`);
  }
});

Then('I should see an error message containing {string}', async function (partialText) {
  await assertVisible(this.loginPage.errorMessage, 'Error message should be visible');
  await assertTextContains(this.loginPage.errorMessage, partialText);
});