import { test, expect } from '../fixtures/base.fixture';

test.describe('Network Interception and Mocking', () => {
  test('Mock product list API and verify intercepted data', async ({ page }) => {
    const mockedProducts = {
      responseCode: 200,
      products: [
        {
          id: 1,
          name: 'Mocked Product A',
          price: 'Rs. 500',
          brand: 'MockBrand',
          category: {
            usertype: { usertype: 'Women' },
            category: 'Tops',
          },
        },
        {
          id: 2,
          name: 'Mocked Product B',
          price: 'Rs. 1000',
          brand: 'MockBrand',
          category: {
            usertype: { usertype: 'Men' },
            category: 'Tshirts',
          },
        },
      ],
    };

    let interceptedRoute = false;

    await page.route('**/api/productsList', (route) => {
      interceptedRoute = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockedProducts),
      });
    });

    await page.goto('/');

    const response = await page.evaluate(async () => {
      const res = await fetch('/api/productsList');
      return res.json();
    });

    expect(interceptedRoute).toBe(true);
    expect(response.products).toHaveLength(2);
    expect(response.products[0].name).toBe('Mocked Product A');
    expect(response.products[1].name).toBe('Mocked Product B');
  });

  test('Intercept and block ad network requests', async ({ page }) => {
    const blockedUrls: string[] = [];

    await page.route(
      /(doubleclick\.net|googlesyndication\.com|googleadservices\.com)/,
      (route) => {
        blockedUrls.push(route.request().url());
        route.abort();
      }
    );

    await page.goto('/');

    const adIframes = await page
      .locator('iframe[src*="googleads"], iframe[src*="doubleclick"]')
      .count();
    expect(adIframes).toBe(0);

    await page.locator('a[href="/products"]').click();
    await expect(page).toHaveURL(/products/);
  });

  test('Intercept navigation response and validate status', async ({ page }) => {
    let capturedStatus: number | null = null;

    page.on('response', (response) => {
      if (response.url().includes('/products') && response.status() === 200) {
        capturedStatus = response.status();
      }
    });

    await page.goto('/products');

    expect(capturedStatus).toBe(200);
  });
});
