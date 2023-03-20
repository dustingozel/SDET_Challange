class ProductsPage {

    constructor(page) {
        this.page = page;
        this.allItemPrices = page.locator('//div[@class="inventory_item_price"]'); // returns all item's prices
        this.backToProductsButton = page.locator('//button[@id="back-to-products"]');
        this.burgerMenuButton = page.locator('//button[@id="react-burger-menu-btn"]');
        this.burgerMenuOptions = page.locator('//nav[@class="bm-item-list"]//a');
        this.checkoutFirstName = page.locator('//input[@id="first-name"]');
        this.checkoutLastName = page.locator('//input[@id="last-name"]');
        this.checkoutZipCode = page.locator('//input[@id="postal-code"]');
        this.checkoutTitle = page.locator('//span[.="Checkout: Overview"]');
        this.items = page.locator('//div[@class="inventory_item_name"]');
        this.logOutButton = page.locator('//a[@id="logout_sidebar_link"]');
        this.priceOfItem = page.locator('//div[@class="inventory_details_price"]');
        this.productsHeader = page.locator('//span[normalize-space()="Products"]');
        this.sauceLabsBackpackAddToCart = page.locator('//button[@name="add-to-cart-sauce-labs-backpack"]');
        this.sauceLabsBackpackRemove = page.locator('//button[@id="remove-sauce-labs-backpack"]');
        this.sauceLabsBikeLightAddtoCart = page.locator('//button[@id="add-to-cart-sauce-labs-bike-light"]');
        this.sauceLabsOnesieAddtoCart = page.locator('//button[@id="add-to-cart-sauce-labs-onesie"]');
        this.sortByDropdown = page.locator('//select[@class="product_sort_container"]');
        this.sortByDropdownOptions = page.locator('//select[@class="product_sort_container"]//option');
        this.shoppingCart = page.locator('//a[@class="shopping_cart_link"]');
        this.shoppingCartBadge = page.locator('//span[@class="shopping_cart_badge"]');
    }

    async getAllBurgerMenuOptionsText() {
        return this.burgerMenuOptions.allTextContents();
    }

    async getAllItemPrices() {
        const allPrices = await this.allItemPrices.allTextContents();
        const prices = [];
    
        for(let i = 0; i < allPrices.length; i++){
          prices.push(allPrices[i].substring(1));
        }
        return prices;
    }
}

module.exports = { ProductsPage };