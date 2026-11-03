import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../fixtures/base.fixture';

test.describe('Accessibility Testing', () => {
  test('Home page accessibility scan', async ({ page, homePage }) => {
    await homePage.navigate();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    if (results.violations.length > 0) {
      console.log(`Home page: ${results.violations.length} total violations found`);
      results.violations.forEach((v) => {
        console.log(`  - [${v.impact}] ${v.id}: ${v.description}`);
      });
    }

    expect(
      criticalViolations.length,
      `Found ${criticalViolations.length} critical accessibility violations on Home page`
    ).toBeLessThanOrEqual(2);
  });

  test('Login page accessibility scan', async ({ page, loginPage }) => {
    await loginPage.navigate();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    if (results.violations.length > 0) {
      console.log(`Login page: ${results.violations.length} total violations found`);
      results.violations.forEach((v) => {
        console.log(`  - [${v.impact}] ${v.id}: ${v.description}`);
      });
    }

    expect(
      criticalViolations.length,
      `Found ${criticalViolations.length} critical accessibility violations on Login page`
    ).toBeLessThanOrEqual(2);
  });

  test('Products page accessibility scan', async ({ page, productsPage }) => {
    await productsPage.navigate();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    if (results.violations.length > 0) {
      console.log(`Products page: ${results.violations.length} total violations found`);
      results.violations.forEach((v) => {
        console.log(`  - [${v.impact}] ${v.id}: ${v.description}`);
      });
    }

    expect(
      criticalViolations.length,
      `Found ${criticalViolations.length} critical accessibility violations on Products page`
    ).toBeLessThanOrEqual(2);
  });
});
