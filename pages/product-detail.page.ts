import { type Page, type Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p:has-text("Category:")');
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
    this.productCondition = page.locator('.product-information p:has-text("Condition:")');
    this.productBrand = page.locator('.product-information p:has-text("Brand:")');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.viewCartLink = page.locator('a:has-text("View Cart")').last();
  }

  async setQuantity(qty: number) {
    await this.quantityInput.clear();
    await this.quantityInput.fill(String(qty));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async clickViewCart() {
    await this.viewCartLink.click();
  }

  async getProductInfo() {
    return {
      name: await this.productName.textContent(),
      price: await this.productPrice.textContent(),
    };
  }
}
