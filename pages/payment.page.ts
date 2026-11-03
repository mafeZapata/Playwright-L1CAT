import { type Page, type Locator } from '@playwright/test';

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payButton: Locator;
  readonly orderConfirmedMessage: Locator;
  readonly continueButton: Locator;
  readonly downloadInvoice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('input[data-qa="card-number"]');
    this.cvcInput = page.locator('input[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
    this.payButton = page.locator('button[data-qa="pay-button"]');
    this.orderConfirmedMessage = page.locator('p:has-text("Congratulations! Your order has been confirmed!")');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
    this.downloadInvoice = page.locator('a:has-text("Download Invoice")');
  }

  async fillPaymentDetails(data: PaymentData) {
    await this.nameOnCardInput.fill(data.nameOnCard);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.cvcInput.fill(data.cvc);
    await this.expiryMonthInput.fill(data.expiryMonth);
    await this.expiryYearInput.fill(data.expiryYear);
  }

  async pay() {
    await this.payButton.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}
