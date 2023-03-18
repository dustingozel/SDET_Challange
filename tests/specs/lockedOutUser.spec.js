const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/loginPage');

const username = JSON.parse(JSON.stringify(require('../testData/userNames.json')));

let page;

test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  
  await page.goto('https://www.saucedemo.com/');

  const title = 'Swag Labs';
  await expect(page).toHaveTitle(title);
});

test('Login Validation', async () => {
  const login = new LoginPage(page);

  await login.username.type(await username.lockedOutUser);
  await login.lastname.type('secret_sauce');

  expect(await login.logInButton).toBeVisible();

  await login.logInButton.click();

  expect(await login.errorMessage.textContent()).toEqual('Epic sadface: Sorry, this user has been locked out.');
  expect(await login.errorButton).toBeVisible();
});

test('Login Validation by Sending Empty Username', async () => {
    const login = new LoginPage(page);
  
    await login.username.type('');
    await login.lastname.type('secret_sauce');
  
    await login.logInButton.click();
  
    expect(await login.errorMessage.textContent()).toEqual('Epic sadface: Username is required');
});

test('Login Validation by Sending Empty Password', async () => {
    const login = new LoginPage(page);
  
    await login.username.type(await username.lockedOutUser);
    await login.lastname.type('');
  
    await login.logInButton.click();
  
    expect(await login.errorMessage.textContent()).toEqual('Epic sadface: Password is required');
});

test('Login Validation by Sending Empty Username and Password', async () => {
    const login = new LoginPage(page);
  
    await login.username.type('');
    await login.lastname.type('');
  
    await login.logInButton.click();
  
    expect(await login.errorMessage.textContent()).toEqual('Epic sadface: Username is required');
});

test('Login Validation by Sending Wrong Username - Password', async () => {
    const login = new LoginPage(page);
  
    await login.username.type(await username.lockedOutUser+'x');
    await login.lastname.type('secret_sauce');
  
    await login.logInButton.click();
  
    const error = 'Epic sadface: Username and password do not match any user in this service';
    expect(await login.errorMessage.textContent()).toEqual(error);

    await login.username.type(await username.lockedOutUser+'x');
    await login.lastname.type('secret_sauceX');
  
    await login.logInButton.click();
    expect(await login.errorMessage.textContent()).toEqual(error);
});

