import { test, expect } from '../fixtures/base.fixture';
import { loadTestData } from '../utils/test-data-loader';
import { generateRandomEmail } from '../utils/helpers';
import type { SignupFormData } from '../pages/signup.page';

interface UsersData {
  registrationUser: SignupFormData & { name: string };
  loginUser: { email: string; password: string; name: string };
}

const users = loadTestData<UsersData>('users.json');

test.describe('User Authentication', () => {
  test('User Registration - register new account and delete it', async ({
    homePage,
    loginPage,
    signupPage,
  }) => {
    const randomEmail = generateRandomEmail();

    await homePage.navigate();
    await homePage.goToSignupLogin();

    await expect(loginPage.signupHeader).toBeVisible();

    await loginPage.startSignup(users.registrationUser.name, randomEmail);

    await expect(signupPage.enterAccountHeader).toBeVisible();

    await signupPage.fillSignupForm(users.registrationUser);
    await signupPage.submitSignup();

    await expect(signupPage.accountCreatedHeader).toBeVisible();
    await signupPage.clickContinue();

    await expect(homePage.loggedInAs).toBeVisible();
    const loggedName = await homePage.getLoggedInUsername();
    expect(loggedName).toBe(users.registrationUser.name);

    await homePage.deleteAccount();
    await expect(signupPage.page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
  });

  test('Login and Logout - login with valid credentials then logout', async ({
    homePage,
    loginPage,
  }) => {
    // First register a user via API to have valid credentials
    const randomEmail = generateRandomEmail();
    const password = users.registrationUser.password;
    const name = users.registrationUser.name;

    // Register via the UI first
    await homePage.navigate();
    await homePage.goToSignupLogin();
    await loginPage.startSignup(name, randomEmail);

    // Fill signup quickly
    const { page } = homePage;
    await page.locator('#id_gender1').check();
    await page.locator('#password').fill(password);
    await page.locator('#days').selectOption(users.registrationUser.birthDay);
    await page.locator('#months').selectOption(users.registrationUser.birthMonth);
    await page.locator('#years').selectOption(users.registrationUser.birthYear);
    await page.locator('#first_name').fill(users.registrationUser.firstName);
    await page.locator('#last_name').fill(users.registrationUser.lastName);
    await page.locator('#address1').fill(users.registrationUser.address1);
    await page.locator('#country').selectOption(users.registrationUser.country);
    await page.locator('#state').fill(users.registrationUser.state);
    await page.locator('#city').fill(users.registrationUser.city);
    await page.locator('#zipcode').fill(users.registrationUser.zipcode);
    await page.locator('#mobile_number').fill(users.registrationUser.mobileNumber);
    await page.locator('button[data-qa="create-account"]').click();
    await page.locator('a[data-qa="continue-button"]').click();

    await expect(homePage.loggedInAs).toBeVisible();

    // Logout
    await homePage.logout();
    await expect(loginPage.loginHeader).toBeVisible();

    // Login back with the same credentials
    await loginPage.login(randomEmail, password);
    await expect(homePage.loggedInAs).toBeVisible();

    // Cleanup: delete account
    await homePage.deleteAccount();
  });
});
