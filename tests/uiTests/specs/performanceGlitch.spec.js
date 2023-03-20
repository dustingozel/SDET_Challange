const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/loginPage');
const { ProductsPage } = require('../pageObjects/productsPage');
const { CartPage } = require('../pageObjects/cartPage');

const username = JSON.parse(JSON.stringify(require('../testData/userNames.json')));
const url = JSON.parse(JSON.stringify(require('../testData/url.json')));

let page;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  
  await page.goto(await url[0].baseUrl);

  const title = 'Swag Labs';
  await expect(page).toHaveTitle(title);
});

//I used Promise blocks to avoid any possible performance source issues.
test('@UI Login, Back To Products and Back Home Button Validation', async () => {
  test.slow();
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);
  const login = new LoginPage(page);

  await login.username.type(await username.performanceGlitchUser);
  await login.lastname.type('secret_sauce');

// When I click to 'LogIn' on login page I am facing with long wait           
  await Promise.all([
    page.waitForLoadState('load'),
    login.logInButton.click()
  ]);

  const itemsCount = await products.items.count();
  for(let i = 0; i < itemsCount; i++) {
    if(await products.items.nth(i).textContent() === "Sauce Labs Fleece Jacket") {
      await products.items.nth(i).click();

// When I click to 'back to products' button on any item's page I am facing with long wait, again I am gonna use Promise blocks to avoid any possible failures because of this issue             
      await Promise.all([
        page.waitForLoadState('load'),
        await products.backToProductsButton.click()
      ]);
    };
  };

  expect(await products.productsHeader).toBeVisible();

  await products.sauceLabsBackpackAddToCart.click();
  await products.shoppingCart.click();
  await shoppingCart.checkoutButton.click();

  await products.checkoutFirstName.type('Dustin');
  await products.checkoutLastName.type('gozel');
  await products.checkoutZipCode.type('22003');

  await shoppingCart.continueSubmitButton.click();
  await shoppingCart.finishButton.click();

  expect( await shoppingCart.successMessage).toBeVisible();

  // Added promise becuase when I place my order then I click to 'Back Home' there is a huge waiting.
  await Promise.all([
    page.waitForLoadState('load'),
    shoppingCart.backHomeButton.click()
  ]);

  expect(await products.productsHeader).toBeVisible();
});