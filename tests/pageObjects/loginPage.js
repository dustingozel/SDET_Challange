class LoginPage {

    constructor(page) {
        this.page = page;
        this.logInButton = page.locator('//input[@id="login-button"]');
    }
}

module.exports = { LoginPage };