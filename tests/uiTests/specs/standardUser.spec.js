const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageObjects/loginPage');
const { ProductsPage } = require('../pageObjects/productsPage');
const { CartPage } = require('../pageObjects/cartPage');

const username = JSON.parse(JSON.stringify(require('../testData/userNames.json')));
const url = JSON.parse(JSON.stringify(require('../testData/url.json')));

let page;

// Here I am using cookies to skip the login. 
test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();

  await page.addInitScript(value => {
    document.cookie = `session-username=${value}`; 
  },username.standardUser);

  await page.goto(await url[0].baseUrl + 'inventory.html');

  const title = 'Swag Labs';
  await expect(page).toHaveTitle(title);
});

// Placing Products page
test('@UI Launch to Products Page', async () => {
  const products = new ProductsPage(page);
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  const headerText = await products.productsHeader.textContent();
  expect(await headerText).toEqual('Products');
});


// Reading datas from json file on testData folder asserting them and logout from app. 
const {
  optionNames,
} = require('../testData/burgerMenuOptions');

test('@UI Logout and Burger Menu Verification', async () => {
  const products = new ProductsPage(page);
  const login = new LoginPage(page);

  await expect(products.burgerMenuButton).toBeVisible();

  await products.burgerMenuButton.click();

  const optionsLength = await products.burgerMenuOptions.count();
  
  for(let i = 1; i < optionsLength; i++) {

    const options = optionNames.get("" + i);
    expect(await products.burgerMenuOptions.nth(i-1).textContent()).toEqual(options);
  };

  await products.logOutButton.click();

  await expect(login.logInButton).toBeVisible();
});

// Whole flow positive purchase scenario.
test('@UI Purchase Verification', async () => {
  test.slow();
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  // Validate if shopping cart is visible
  await expect(products.shoppingCart).toBeVisible();

  // Validate if shopping cart is empty since no item has added to cart
  await expect(products.shoppingCartBadge).not.toBeVisible();

  const itemsCount = await products.items.count();

  for(let i = 0; i < itemsCount; i++) {

    if(await products.items.nth(i).textContent() === "Sauce Labs Backpack") {

      await products.items.nth(i).click();
      const price = await products.priceOfItem.textContent();

      await products.sauceLabsBackpackAddToCart.click();

      // Validate if the remove button became a visible after I click "Add To Cart" button
      await expect(shoppingCart.sauceLabsBackpackRemove).toBeVisible();

      await products.shoppingCart.click();

      // Validate if the price of the added item is matching with the price on cart
      expect(await price).toEqual(await shoppingCart.priceOfItem.textContent());

      // Validate title
      expect(await shoppingCart.title.textContent()).toEqual("Your Cart");

      // Validate cart quantity
      expect(await shoppingCart.cartQuantity.textContent()).toEqual("1");

      // Clicking continue shopping button to see if I can go back to Produscts page and see the all items
      await shoppingCart.continueShoppingButton.click()

      for(let k = 1; k < itemsCount; k++) {
        expect(await products.items.nth(k)).toBeVisible();
      };

      // Back to cart to continue checkout
      await products.shoppingCart.click();
      await shoppingCart.checkoutButton.click();

      // Fill the checkout blanks 
      const informationCounts = await shoppingCart.checkoutInformations.count();

      for(let j = 0; j < informationCounts; j++) {
        if(await shoppingCart.checkoutInformations.nth(j).getAttribute("id") === 'first-name') {
          await shoppingCart.checkoutInformations.nth(j).type('Dustin');
        } else if ( await shoppingCart.checkoutInformations.nth(j).getAttribute("id") === 'last-name' ) {
          await shoppingCart.checkoutInformations.nth(j).type('Gozel');
        } else {
          await shoppingCart.checkoutInformations.nth(j).type('22003');
        }
      };

      await shoppingCart.continueSubmitButton.click();
      const subTotal = await shoppingCart.subTotal.textContent();

      // Validate item price and subtotal if matching
      expect(await price).toEqual(subTotal.substring(subTotal.indexOf("$")));

      await shoppingCart.finishButton.click();
      expect(await shoppingCart.successMessage.textContent()).toEqual('Thank you for your order!');
      expect(await shoppingCart.successImage).toBeVisible();

      await shoppingCart.backHomeButton.click();
      expect(products.productsHeader).toBeVisible();
    }
  }
});

// By changing sorting dropdown option and validate if it is working correctly.
test('@UI Sort By Dropdown Function Verification', async () => {
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  await products.sortByDropdown.click();

  await Promise.all([
    page.waitForLoadState('load'),
    products.sortByDropdown.selectOption('lohi')
  ]);
    
  const lowToHighPrices = await products.getAllItemPrices();

  for(let i = 0; i < lowToHighPrices.length-1; i++) {
    expect(Number(lowToHighPrices[i])).toBeLessThanOrEqual(Number(lowToHighPrices[i+1]));
  };

  await products.sauceLabsOnesieAddtoCart.click();
  await products.sauceLabsBikeLightAddtoCart.click();

  await products.shoppingCart.click();
  await shoppingCart.checkoutButton.click();

  await products.checkoutFirstName.type('Dustin');
  await products.checkoutLastName.type('Gozel');
  await products.checkoutZipCode.type('22003');

  await shoppingCart.continueSubmitButton.click();

  expect(await products.checkoutTitle).toBeVisible('Checkout: Overview');

  await shoppingCart.finishButton.click();

  expect(await shoppingCart.successText.textContent()).toContain('Your order has been dispatched');
  expect(await shoppingCart.backHomeButton).toBeVisible();

  await shoppingCart.backHomeButton.click();
});

// Scenario of placing order without adding item.
test('@UI Complete Checkout without Adding Item', async () => {
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  await expect(products.shoppingCartBadge).not.toBeVisible();
  await products.shoppingCart.click();
  await expect(shoppingCart.cartItems).not.toBeVisible();

  await shoppingCart.checkoutButton.click();

  const informationCounts = await shoppingCart.checkoutInformations.count();

  for(let k = 0; k < informationCounts; k++) {
    if(await shoppingCart.checkoutInformations.nth(k).getAttribute("id") === 'first-name') {
      await shoppingCart.checkoutInformations.nth(k).type('Dustin');
    } else if ( await shoppingCart.checkoutInformations.nth(k).getAttribute("id") === 'last-name' ) {
      await shoppingCart.checkoutInformations.nth(k).type('Gozel');
    } else {
      await shoppingCart.checkoutInformations.nth(k).type('22003');
    }
  };

  await shoppingCart.continueSubmitButton.click();

  await shoppingCart.finishButton.click();

  expect(await shoppingCart.checkoutCompleteTitle.textContent()).toEqual('Checkout: Complete!');
});

// Scenario of removing item via Shopping cart and cancel the proccess from checkout page.
test('@UI Shopping Cart Remove and Cancel Validation', async () => {
  const products = new ProductsPage(page);
  const shoppingCart = new CartPage(page);

  await expect(products.shoppingCartBadge).not.toBeVisible();

  await products.sauceLabsBikeLightAddtoCart.click();
  await expect(products.shoppingCartBadge).toBeVisible();

  await products.shoppingCart.click();
  expect(await shoppingCart.sauceLabsBikeLightRemove).toBeVisible();

  await shoppingCart.sauceLabsBikeLightRemove.click();
  expect(await shoppingCart.sauceLabsBikeLightRemove).not.toBeVisible();
  expect(await shoppingCart.cartItems).not.toBeVisible();

  await shoppingCart.continueShoppingButton.click();
  await products.sauceLabsBikeLightAddtoCart.click();
  await products.shoppingCart.click();
  await shoppingCart.checkoutButton.click();
  await shoppingCart.cancelButton.click();

  expect(await shoppingCart.yourCartTitle.textContent()).toEqual('Your Cart');

  await shoppingCart.sauceLabsBikeLightRemove.click();
  await shoppingCart.continueShoppingButton.click();

  expect(await products.productsHeader.textContent()).toEqual('Products');
});
