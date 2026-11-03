import { type Page, type Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly deliveryAddressBox: Locator;
  readonly billingAddressBox: Locator;
  readonly deliveryFirstLastName: Locator;
  readonly deliveryAddress1: Locator;
  readonly deliveryCityStateZip: Locator;
  readonly deliveryCountry: Locator;
  readonly deliveryPhone: Locator;
  readonly orderComment: Locator;
  readonly placeOrderButton: Locator;
  readonly cartItemRows: Locator;
  readonly totalAmount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deliveryAddressBox = page.locator('#address_delivery');
    this.billingAddressBox = page.locator('#address_invoice');
    this.deliveryFirstLastName = page.locator('#address_delivery .address_firstname');
    this.deliveryAddress1 = page.locator('#address_delivery li.address_address1').nth(1);
    this.deliveryCityStateZip = page.locator('#address_delivery .address_city');
    this.deliveryCountry = page.locator('#address_delivery .address_country_name');
    this.deliveryPhone = page.locator('#address_delivery .address_phone');
    this.orderComment = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a:has-text("Place Order")');
    this.cartItemRows = page.locator('#cart_info tbody tr');
    this.totalAmount = page.locator('.cart_total_price');
  }

  async addComment(comment: string) {
    await this.orderComment.fill(comment);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async getDeliveryAddressName(): Promise<string> {
    return (await this.deliveryFirstLastName.textContent()) || '';
  }

  async getDeliveryAddress(): Promise<string> {
    return (await this.deliveryAddress1.textContent()) || '';
  }

  async getDeliveryPhone(): Promise<string> {
    return (await this.deliveryPhone.textContent()) || '';
  }
}
