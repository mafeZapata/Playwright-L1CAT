import { test, expect } from '../fixtures/base.fixture';
import { loadTestData } from '../utils/test-data-loader';
import path from 'path';

interface ContactEntry {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactData {
  contactEntries: ContactEntry[];
}

const contactData = loadTestData<ContactData>('contact.json');
const uploadFilePath = path.resolve(__dirname, '..', 'testdata', 'upload-sample.txt');

test.describe('Contact Us Form Validation', () => {
  for (const [index, entry] of contactData.contactEntries.entries()) {
    test(`Submit Contact Us form - data set ${index + 1}: ${entry.subject}`, async ({
      contactUsPage,
      homePage,
      page,
    }) => {
      await contactUsPage.navigate();
      await expect(contactUsPage.getInTouchHeader).toBeVisible({ timeout: 30_000 });

      await contactUsPage.fillContactForm({
        ...entry,
        filePath: uploadFilePath,
      });

      await contactUsPage.submit();

      await expect(contactUsPage.successMessage).toBeVisible();

      await contactUsPage.clickHome();
      await expect(homePage.slider).toBeVisible({ timeout: 30_000 });
    });
  }
});
