import { test, expect } from '../fixtures/base.fixture';
import { loadTestData } from '../utils/test-data-loader';

interface ProductsData {
  searchTerms: string[];
  productToAdd: { index: number; expectedName: string };
}

const products = loadTestData<ProductsData>('products.json');

test.describe('Product Search and Cart Operations', () => {
  test('Search for products and verify results', async ({ productsPage }) => {
    await productsPage.navigate();
    await expect(productsPage.allProductsTitle).toBeVisible();

    const searchTerm = products.searchTerms[0];
    await productsPage.searchProduct(searchTerm);

    await expect(productsPage.searchedProductsTitle).toBeVisible();

    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);

    const names = await productsPage.getProductNames();
    const matchingNames = names.filter((n) =>
      n.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(matchingNames.length).toBeGreaterThan(0);
  });

  test('Add product to cart and remove it', async ({ productsPage, cartPage, page }) => {
    await productsPage.navigate();
    await expect(productsPage.allProductsTitle).toBeVisible();

    await productsPage.addProductToCartByIndex(products.productToAdd.index);
    await productsPage.clickViewCart();

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    await cartPage.removeItemByIndex(0);
    await page.waitForTimeout(2000);
    await expect(cartPage.emptyCartMessage).toBeVisible({ timeout: 10_000 });
  });
});
