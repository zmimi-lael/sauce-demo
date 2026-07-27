const { Given, When, Then } = require('@cucumber/cucumber');
const { faker } = require('@faker-js/faker');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutInfoPage } = require('../pages/CheckoutInfoPage');
const { CheckoutOverviewPage } = require('../pages/CheckoutOverviewPage');
const { CheckoutCompletePage } = require('../pages/CheckoutCompletePage');
const {
  assertVisible,
  assertTextContains,
  assertUrlContains,
  assertElementCount,
} = require('../../utils/assertions');


When('I add the product {string} to the cart', async function (productName) {
  this.inventoryPage = this.inventoryPage || new InventoryPage(this.page);
  await this.inventoryPage.addItemToCartByName(productName);
  this.selectedProduct = productName;
});

When('I open the shopping cart', async function () {
  this.inventoryPage = this.inventoryPage || new InventoryPage(this.page);
  await this.inventoryPage.openCart();
  this.cartPage = new CartPage(this.page);
  await assertVisible(this.cartPage.pageTitle, 'Cart page title should be visible');
  await assertUrlContains(this.page, 'cart.html');
});

When('I proceed to checkout', async function () {
  this.cartPage = this.cartPage || new CartPage(this.page);
  await this.cartPage.proceedToCheckout();
  this.checkoutInfoPage = new CheckoutInfoPage(this.page);
  await this.checkoutInfoPage.isLoaded();
  await assertUrlContains(this.page, 'checkout-step-one.html');
});

When('I fill the checkout information with random customer data', async function () {
  this.checkoutInfoPage = this.checkoutInfoPage || new CheckoutInfoPage(this.page);

  // Generate realistic fake data with Faker
  this.customer = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode('#####'), // 5-digit US-style zip
  };

  await this.checkoutInfoPage.fillCustomerInfo(
    this.customer.firstName,
    this.customer.lastName,
    this.customer.postalCode
  );
});

When('I continue to the overview', async function () {
  this.checkoutInfoPage = this.checkoutInfoPage || new CheckoutInfoPage(this.page);
  await this.checkoutInfoPage.continue();

  this.checkoutOverviewPage = new CheckoutOverviewPage(this.page);
  await this.checkoutOverviewPage.isLoaded();
  await assertUrlContains(this.page, 'checkout-step-two.html');

  // Assert the product is still in the overview
  const itemCount = await this.checkoutOverviewPage.getItemCount();
  if (itemCount < 1) {
    throw new Error(`Expected at least 1 item on overview, found ${itemCount}`);
  }
});

When('I finish the order', async function () {
  this.checkoutOverviewPage = this.checkoutOverviewPage || new CheckoutOverviewPage(this.page);
  await this.checkoutOverviewPage.finish();
});

Then('I should see the order confirmation', async function () {
  this.checkoutCompletePage = new CheckoutCompletePage(this.page);
  await this.checkoutCompletePage.isLoaded();
  await assertUrlContains(this.page, 'checkout-complete.html');
  await assertVisible(this.checkoutCompletePage.completeHeader, 'Confirmation header should be visible');
  await assertVisible(this.checkoutCompletePage.ponyExpressImage, 'Pony express image should be visible');
});

Then('the confirmation message should contain {string}', async function (partialText) {
  this.checkoutCompletePage = this.checkoutCompletePage || new CheckoutCompletePage(this.page);
  await assertTextContains(this.checkoutCompletePage.completeHeader, partialText);
});