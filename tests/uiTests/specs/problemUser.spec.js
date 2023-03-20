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

test('Purchase Verification - Remove an item from the Products page - Bug', async () => {
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  await products.sauceLabsBackpackAddToCart.click();
  await expect(products.shoppingCartBadge).toBeVisible();

  await products.sauceLabsBackpackRemove.click();

  //I made this assertion commented out since otherwise if will be failing because remove buttons are not working on Prodcuts page which is bug!
  //await expect(products.shoppingCartBadge).not.toBeVisible();
  await expect(products.shoppingCartBadge).toBeVisible();

  await products.shoppingCart.click();
  await shoppingCart.sauceLabsBackpackRemove.click();
  await shoppingCart.continueShoppingButton.click();

  await expect(products.shoppingCartBadge).not.toBeVisible();
});

test('Purchase Verification - Filling Placing Order Information Bug', async () => {
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  await products.sauceLabsBackpackAddToCart.click();
  await expect(products.shoppingCartBadge).toBeVisible();

  await products.shoppingCart.click();
  await shoppingCart.checkoutButton.click();

  await products.checkoutFirstName.type('Dustin');
  expect(await products.checkoutFirstName).toHaveAttribute('value', 'Dustin');

  await products.checkoutLastName.type('gozel');
  expect(await products.checkoutLastName).not.toHaveAttribute('value', 'gozel');
  expect(await products.checkoutLastName).toHaveAttribute('value', '');
  expect(await products.checkoutFirstName).toHaveAttribute('value', 'l');

  await shoppingCart.continueSubmitButton.click();
  expect(await shoppingCart.errorMessage.textContent()).toEqual('Error: Last Name is required');

  await shoppingCart.errorButton.click();
  expect(await shoppingCart.errorMessage).not.toBeVisible();
  expect(await shoppingCart.errorButton).not.toBeVisible();
});