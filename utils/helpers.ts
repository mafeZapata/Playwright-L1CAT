import { type Page } from '@playwright/test';

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `testuser_${timestamp}_${random}@testmail.com`;
}

export function generateTimestamp(): string {
  return Date.now().toString();
}

export async function blockAds(page: Page) {
  await page.route(
    /(doubleclick\.net|googlesyndication\.com|googleadservices\.com|google-analytics\.com|googletagmanager\.com|adservice\.google)/,
    (route) => route.abort()
  );
}

export async function dismissAdsIfPresent(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll(
      'iframe[id^="aswift_"], iframe[id^="google_ads"], ins.adsbygoogle, #dismiss-button'
    ).forEach((el) => el.remove());
  });
}

export async function waitForCloudflare(page: Page) {
  // Cloudflare JS challenges often fire slightly after domcontentloaded — give them time to appear
  await page.waitForTimeout(2000);
  try {
    const verificationText = page.locator('text=Please wait while your request is being verified');
    const isVerifying = await verificationText.isVisible({ timeout: 10_000 }).catch(() => false);
    if (isVerifying) {
      await verificationText.waitFor({ state: 'hidden', timeout: 60_000 });
      // After challenge clears, wait for the real page to settle
      await page.waitForTimeout(1000);
    }
  } catch {
    // Cloudflare didn't resolve — let the test continue and fail on the actual assertion
  }
  await page.waitForLoadState('domcontentloaded');
}
