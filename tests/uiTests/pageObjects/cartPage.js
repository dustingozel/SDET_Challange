class CartPage {

    constructor(page) {
        this.page = page;
        this.backHomeButtoon = page.locator('//button[@id="back-to-products"]');
        this.cancelButton = page.locator('//button[@id="cancel"]');
        this.cartQuantity = page.locator('//div[@class="cart_quantity"]');
        this.cartItems = page.locator('//div[@class="cart_item_label"]');
        this.checkoutButton = page.locator('//button[@id="checkout"]');
        this.checkoutCompleteTitle = page.locator('//div[.="Checkout: Complete!"]');
        this.checkoutInformations = page.locator('//div[@class="form_group"]//input');
        this.continueSubmitButton = page.locator('//input[@id="continue"]');
        this.continueShoppingButton = page.locator('//button[@id="continue-shopping"]');
        this.finishButton = page.locator('//button[@id="finish"]');
        this.priceOfItem = page.locator('//div[@class="inventory_item_price"]');
        this.sauceLabsBackpackRemove = page.locator('//button[@id="remove-sauce-labs-backpack"]');
        this.sauceLabsBikeLightRemove = page.locator('//button[@id="remove-sauce-labs-bike-light"]');
        this.subTotal = page.locator('//div[@class="summary_subtotal_label"]');
        this.successImage = page.locator('//img[@alt="Pony Express"]');
        this.successMessage = page.locator('//h2[@class="complete-header"]');
        this.successText = page.locator('//div[@class="complete-text"]');
        this.title = page.locator('span.title');
        this.quantityTab = page.locator('//div[@class="cart_quantity_label"]');
        this.yourCartTitle = page.locator('//span[.="Your Cart"]');
    }
}

module.exports = { CartPage };