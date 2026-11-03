import { test, expect } from '../fixtures/base.fixture';
import { loadTestData } from '../utils/test-data-loader';
import { generateRandomEmail } from '../utils/helpers';
import type { SignupFormData } from '../pages/signup.page';
import type { PaymentData } from '../pages/payment.page';

interface UsersData {
  registrationUser: SignupFormData & { name: string };
}

interface CheckoutData {
  payment: PaymentData;
  orderComment: string;
}

const users = loadTestData<UsersData>('users.json');
const checkout = loadTestData<CheckoutData>('checkout.json');

test.describe('Checkout and Order Placement', () => {
  test('Complete checkout flow - register, add product, checkout, pay, verify order', async ({
    homePage,
    loginPage,
    signupPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const randomEmail = generateRandomEmail();
    const regData = users.registrationUser;

    // Step 1: Register a new account
    await homePage.navigate();
    await homePage.goToSignupLogin();
    await loginPage.startSignup(regData.name, randomEmail);
    await signupPage.fillSignupForm(regData);
    await signupPage.submitSignup();
    await expect(signupPage.accountCreatedHeader).toBeVisible();
    await signupPage.clickContinue();
    await expect(homePage.loggedInAs).toBeVisible();

    // Step 2: Add products to cart
    await homePage.goToProducts();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.clickContinueShopping();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.clickViewCart();

    // Step 3: Verify cart has items
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);

    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.deliveryAddressBox.waitFor({ state: 'visible', timeout: 30_000 });

    // Step 5: Verify delivery address
    const addressName = await checkoutPage.getDeliveryAddressName();
    expect(addressName).toContain(regData.firstName);

    // Step 6: Add comment and place order
    await checkoutPage.addComment(checkout.orderComment);
    await checkoutPage.placeOrder();

    // Step 7: Fill payment details and pay
    await paymentPage.fillPaymentDetails(checkout.payment);
    await paymentPage.pay();

    // Step 8: Verify order confirmed
    await expect(paymentPage.orderConfirmedMessage).toBeVisible();

    // Cleanup: delete account
    await paymentPage.clickContinue();
    await homePage.deleteAccount();
  });
});
