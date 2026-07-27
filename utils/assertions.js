const { expect } = require('@playwright/test');

async function assertVisible(locator, message) {
  await expect(locator, message || 'Element should be visible').toBeVisible();
}

async function assertHidden(locator, message) {
  await expect(locator, message || 'Element should be hidden').toBeHidden();
}

async function assertTextEquals(locator, expectedText, message) {
  await expect(locator, message || `Text should equal "${expectedText}"`).toHaveText(expectedText);
}

async function assertTextContains(locator, partialText, message) {
  await expect(locator, message || `Text should contain "${partialText}"`).toContainText(partialText);
}

async function assertUrlContains(page, partialUrl, message) {
  await expect(page, message || `URL should contain "${partialUrl}"`).toHaveURL(new RegExp(partialUrl));
}

async function assertElementCount(locator, expectedCount, message) {
  await expect(locator, message || `Should have ${expectedCount} elements`).toHaveCount(expectedCount);
}

module.exports = {
  assertVisible,
  assertHidden,
  assertTextEquals,
  assertTextContains,
  assertUrlContains,
  assertElementCount,
  expect, // re-export Playwright expect for convenience
};