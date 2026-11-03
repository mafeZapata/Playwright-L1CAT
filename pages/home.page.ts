import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly loggedInAs: Locator;
  readonly deleteAccountLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly contactUsLink: Locator;
  readonly homeLink: Locator;
  readonly subscriptionEmail: Locator;
  readonly subscribeButton: Locator;
  readonly subscriptionSuccess: Locator;
  readonly featuredItems: Locator;
  readonly slider: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupLoginLink = page.locator('a[href="/login"]');
    this.logoutLink = page.locator('a[href="/logout"]');
    this.loggedInAs = page.locator('a:has-text("Logged in as")');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.productsLink = page.locator('a[href="/products"]');
    this.cartLink = page.locator('a[href="/view_cart"]');
    this.contactUsLink = page.locator('a[href="/contact_us"]');
    this.homeLink = page.locator('a[href="/"]').first();
    this.subscriptionEmail = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscriptionSuccess = page.locator('.alert-success.alert');
    this.featuredItems = page.locator('.features_items');
    this.slider = page.locator('#slider');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async goToSignupLogin() {
    await this.signupLoginLink.waitFor({ state: 'visible', timeout: 30_000 });
    await this.signupLoginLink.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async goToContactUs() {
    await this.contactUsLink.click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async deleteAccount() {
    await this.deleteAccountLink.click();
  }

  async getLoggedInUsername(): Promise<string> {
    const text = await this.loggedInAs.textContent();
    return text?.replace('Logged in as ', '').trim() || '';
  }

  async isLoggedIn(): Promise<boolean> {
    return this.loggedInAs.isVisible();
  }
}
