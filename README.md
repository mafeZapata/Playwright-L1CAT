# Playwright E-Commerce Automation Framework

Enterprise-grade Playwright TypeScript automation framework for [automationexercise.com](https://automationexercise.com/).

## Framework Architecture

```
├── config/                 # Environment configuration
│   └── env.config.ts       # Base URLs, timeouts, retry settings
├── fixtures/               # Custom Playwright fixtures
│   └── base.fixture.ts     # Extended test with page object injection
├── pages/                  # Page Object Model classes
│   ├── home.page.ts        # Homepage navigation and elements
│   ├── login.page.ts       # Login and signup initiation
│   ├── signup.page.ts      # Full registration form
│   ├── products.page.ts    # Product listing and search
│   ├── product-detail.page.ts # Individual product view
│   ├── cart.page.ts        # Shopping cart operations
│   ├── checkout.page.ts    # Order review and address verification
│   ├── payment.page.ts     # Payment form and order confirmation
│   └── contact-us.page.ts  # Contact form with file upload
├── tests/                  # Test specifications
│   ├── auth.spec.ts        # Registration, login, logout
│   ├── product-search.spec.ts  # Search and cart add/remove
│   ├── checkout.spec.ts    # End-to-end checkout flow
│   ├── contact-us.spec.ts  # Contact form (data-driven)
│   ├── network-mock.spec.ts    # API interception and mocking
│   ├── accessibility.spec.ts   # axe-core WCAG validation
│   └── visual.spec.ts     # Visual regression screenshots
├── testdata/               # External test data (JSON)
│   ├── users.json          # User registration/login data
│   ├── products.json       # Product search terms
│   ├── checkout.json       # Payment and address data
│   ├── contact.json        # Contact form entries (data-driven)
│   └── upload-sample.txt   # Sample file for upload tests
├── utils/                  # Reusable utilities
│   ├── helpers.ts          # Random email/timestamp generators
│   └── test-data-loader.ts # Typed JSON data loader
├── playwright.config.ts    # Playwright configuration
└── tsconfig.json           # TypeScript configuration
```

## Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# Run all tests (all browsers)
npm test

# Run on a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run in headed mode (visible browser)
npm run test:headed

# Run in debug mode (step through)
npm run test:debug

# Run with Playwright UI
npm run test:ui

# Run a specific test file
npx playwright test tests/auth.spec.ts

# Update visual regression snapshots
npm run update-snapshots
```

## Viewing Reports

```bash
# Open HTML report
npm run report

# Open trace viewer for a specific trace
npm run trace test-results/<trace-file>.zip
```

## Design Decisions

### Page Object Model (POM)
Each page has a dedicated class encapsulating its locators and actions. Page objects receive a `Page` instance via constructor and expose:
- **Readonly locators** for assertions in tests
- **Action methods** for user interactions (click, fill, navigate)
- **Getter methods** for extracting page state

### Custom Fixtures
The framework extends Playwright's `test` object with pre-built page object instances. Tests destructure the fixtures they need — no manual page object construction.

### Data-Driven Testing
Test data lives in `testdata/*.json` files, loaded via a typed utility. The Contact Us test demonstrates parameterized execution iterating over multiple data entries.

### Network Interception
`network-mock.spec.ts` demonstrates:
- Mocking API responses with `page.route()`
- Intercepting and validating outgoing requests
- Fulfilling routes with custom JSON payloads

### Accessibility Testing
Uses `@axe-core/playwright` to run WCAG 2.0 Level A and AA checks on key pages. Tests filter for critical/serious violations and log detailed findings.

### Visual Regression
Uses Playwright's built-in `toHaveScreenshot()` for pixel-level comparison. First run creates baseline snapshots; subsequent runs compare against them.

### Cross-Browser Execution
`playwright.config.ts` defines three projects: Chromium, Firefox, and WebKit. Each can be run independently or all together.

### Trace and Debugging
- Traces are captured on first retry (`trace: 'on-first-retry'`)
- Screenshots are captured on failure (`screenshot: 'only-on-failure'`)
- Video is retained on failure (`video: 'retain-on-failure'`)

## Test Coverage

| Test | Description | Type |
|------|-------------|------|
| User Registration | Register new account, verify creation, delete | Functional |
| Login and Logout | Login with valid credentials, logout, re-login | Functional |
| Product Search | Search products, verify filtered results | Functional |
| Cart Add/Remove | Add product to cart, verify, remove, verify empty | Functional |
| Checkout Flow | Full E2E: register → add products → checkout → pay → confirm | Functional |
| Contact Us Form | Data-driven form submission with file upload (3 data sets) | Data-Driven |
| Network Mocking | Mock product API, intercept search requests | Advanced |
| Accessibility | WCAG 2.0 AA checks on Home, Login, Products pages | Modern |
| Visual Regression | Full-page screenshot comparison for Home and Login | Modern |

## AI-Assisted Development

This framework was developed with AI assistance (Claude/Copilot) for:
- Initial framework scaffolding and structure
- Page object locator strategy suggestions
- Test case design and data-driven pattern implementation
- Configuration optimization

All AI-generated code was reviewed, tested, and optimized for the specific application under test. Locators were validated against the live site, and test flows were verified end-to-end.
