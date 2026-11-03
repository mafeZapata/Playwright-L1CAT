import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly registerLoginLink: Locator;
  readonly quantityCells: Locator;
  readonly priceCells: Locator;
  readonly totalCells: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed To Checkout")');
    this.emptyCartMessage = page.locator('span#empty_cart');
    this.registerLoginLink = page.locator('a:has-text("Register / Login")');
    this.quantityCells = page.locator('.cart_quantity button');
    this.priceCells = page.locator('.cart_price p');
    this.totalCells = page.locator('.cart_total_price');
    this.deleteButtons = page.locator('.cart_delete a');
  }

  async navigate() {
    await this.page.goto('/view_cart');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

  async removeItemByIndex(index: number) {
    await this.deleteButtons.nth(index).click();
  }

  async getItemQuantity(index: number): Promise<string> {
    const qty = this.cartItems.nth(index).locator('.cart_quantity button');
    return (await qty.textContent()) || '';
  }

  async getItemPrice(index: number): Promise<string> {
    const price = this.cartItems.nth(index).locator('.cart_price p');
    return (await price.textContent()) || '';
  }

  async isCartEmpty(): Promise<boolean> {
    return this.emptyCartMessage.isVisible();
  }
}
