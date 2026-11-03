import { type Page, type Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsTitle: Locator;
  readonly productCards: Locator;
  readonly allProductsTitle: Locator;
  readonly firstProductViewLink: Locator;
  readonly productOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsTitle = page.locator('h2:has-text("Searched Products")');
    this.productCards = page.locator('.productinfo');
    this.allProductsTitle = page.locator('h2:has-text("All Products")');
    this.firstProductViewLink = page.locator('a[href="/product_details/1"]').first();
    this.productOverlay = page.locator('.product-overlay');
  }

  async navigate() {
    await this.page.goto('/products');
  }

  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async addProductToCartByIndex(index: number) {
    const product = this.page.locator('.features_items .col-sm-4').nth(index);
    await product.hover();
    await product.locator('.overlay-content .add-to-cart').click();
  }

  async clickContinueShopping() {
    await this.page.locator('button:has-text("Continue Shopping")').click();
  }

  async clickViewCart() {
    await this.page.locator('a:has-text("View Cart")').last().click();
  }

  async viewFirstProductDetails() {
    await this.firstProductViewLink.click();
  }

  async getProductNames(): Promise<string[]> {
    const names: string[] = [];
    const items = this.productCards.locator('p');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      if (text) names.push(text.trim());
    }
    return names;
  }
}
