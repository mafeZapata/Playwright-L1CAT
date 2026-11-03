import { type Page, type Locator } from '@playwright/test';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  filePath?: string;
}

export class ContactUsPage {
  readonly page: Page;
  readonly getInTouchHeader: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly fileUploadInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getInTouchHeader = page.locator('h2:has-text("Get In Touch")');
    this.nameInput = page.locator('input[data-qa="name"]');
    this.emailInput = page.locator('input[data-qa="email"]');
    this.subjectInput = page.locator('input[data-qa="subject"]');
    this.messageInput = page.locator('textarea[data-qa="message"]');
    this.fileUploadInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('input[data-qa="submit-button"]');
    this.successMessage = page.locator('#contact-page .alert-success');
    this.homeButton = page.locator('a:has-text("Home")').last();
  }

  async navigate() {
    await this.page.goto('/contact_us');
  }

  async fillContactForm(data: ContactFormData) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.subjectInput.fill(data.subject);
    await this.messageInput.fill(data.message);
    if (data.filePath) {
      await this.fileUploadInput.setInputFiles(data.filePath);
    }
  }

  async submit() {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }

  async clickHome() {
    await this.page.goto('/');
  }
}
