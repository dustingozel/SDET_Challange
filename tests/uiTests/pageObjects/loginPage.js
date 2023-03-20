class LoginPage {

    constructor(page) {
        this.page = page;
        this.errorMessage = page.locator('//h3[@data-test="error"]');
        this.errorButton = page.locator('//button[@class="error-button"]');
        this.logInButton = page.locator('//input[@id="login-button"]');
        this.username = page.locator('//input[@id="user-name"]');
        this.lastname = page.locator('//input[@id="password"]');
    }
}

module.exports = { LoginPage };