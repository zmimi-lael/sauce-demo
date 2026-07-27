const { BasePage } = require('./BasePage');


class LoginPage extends BasePage {

  constructor(page) {
    super(page);

    // Locators – prefer data-test attributes when available (SauceDemo has them)
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginLogo = page.locator('.login_logo');
  }

  async open() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsStandardUser(env) {
    await this.login(env.username, env.password);
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }
}

module.exports = { LoginPage };