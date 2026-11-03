import { test, expect } from '../fixtures/base.fixture';
import { dismissAdsIfPresent } from '../utils/helpers';

test.describe('Visual Regression Testing', () => {
  test('Home page visual snapshot', async ({ homePage, page }) => {
    await homePage.navigate();
    await dismissAdsIfPresent(page);
    await page.evaluate(() => {
      document.querySelectorAll('.carousel, .recommended_items, iframe').forEach((el) => el.remove());
    });

    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('Login page visual snapshot', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await dismissAdsIfPresent(page);

    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});
