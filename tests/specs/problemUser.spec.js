const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/loginPage');
const { ProductsPage } = require('../pageObjects/productsPage');
const { CartPage } = require('../pageObjects/cartPage');

const username = JSON.parse(JSON.stringify(require('../testData/userNames.json')));

let page;

test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();

  await page.addInitScript(value => {
    document.cookie = `session-username=${value}`; 
  },username.problemUser);

  await page.goto('https://www.saucedemo.com/inventory.html');

  const title = 'Swag Labs';
  await expect(page).toHaveTitle(title);
});

test('Launch to Products Page', async () => {
  const products = new ProductsPage(page);
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  
  const headerText = await products.productsHeader.textContent();
  expect(await headerText).toEqual('Products');
});

test('Purchase Verification', async () => {
  test.slow();
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  await products.sauceLabsBackpackAddToCart.click();
  await expect(products.shoppingCartBadge).toBeVisible();

  await products.shoppingCart.click();
  await shoppingCart.checkoutButton.click();

  await products.checkoutFirstName.type('Dustin');


});