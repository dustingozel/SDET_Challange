const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/loginPage');
const { ProductsPage } = require('../pageObjects/productsPage');
const { CartPage } = require('../pageObjects/cartPage');

const username = JSON.parse(JSON.stringify(require('../testData/userNames.json')));

let page;

test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  
  await page.goto('https://www.saucedemo.com/');

  const title = 'Swag Labs';
  await expect(page).toHaveTitle(title);
});

// Because of the long wait on the login I am gonna use Promise blocak to avoid any failires because of this issue
test('Login Button Validation', async () => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);

  await login.username.type(await username.performance_glitch_user);
  await login.lastname.type('secret_sauce');

  expect(await login.logInButton).toBeVisible();

  await Promise.all([
    page.waitForLoadState('load'),
    login.logInButton.click()
  ]);

  expect(await products.productsHeader).toBeVisible();
});

// When I click to 'back to products' on any item's page I am facing with long wait, again I am gonna use Promise blocaks to avoid any possible failures because of this issue 
test('Back to Products Button Validation', async () => {
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  const itemsCount = await products.items.count();
  for(let i = 0; i < itemsCount; i++) {
    if(await products.items.nth(i).textContent() === "Sauce Labs Fleece Jacket") {
      await products.items.nth(i).click();
      
      await Promise.all([
        page.waitForLoadState('load'),
        products.backToProductsButton.click()
      ]);
    }
  }

  expect(await products.productsHeader).toBeVisible();
});

// Added promise becuase when I place my order then I click to 'Back Home' there is a huge waiting.
test('Back Home Button Validation', async () => {
  test.slow();
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  await products.sauceLabsBackpackAddToCart.click();
  await products.shoppingCart.click();
  await shoppingCart.checkoutButton.click();

  await products.checkoutFirstName.type('Dustin');
  await products.checkoutLastName.type('gozel');
  await products.checkoutZipCode.type('22003');

  await shoppingCart.continueSubmitButton.click();
  await shoppingCart.finishButton().click();

  expect( await shoppingCart.successMessage).toBeVisible();

  await Promise.all([
    page.waitForLoadState('load'),
    shoppingCart.backHomeButton()
  ]);

  expect(await products.productsHeader).toBeVisible();
});