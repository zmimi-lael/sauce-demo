# sauce-demo
This is a demo project for Sauce Demo UI and API

A ready-to-use base template for UI automation using:

- **Playwright** (browser automation + API request context)
- **Cucumber.js** (Gherkin / BDD – the JavaScript equivalent of SpecFlow)
- **Page Object Model**
- Multi-environment support (QA / STG)
- Centralized assertions helper
- **Faker.js** for generating random customer data in checkout
- Simple **API GET** tests against [restful-booker.herokuapp.com](https://restful-booker.herokuapp.com)

---

## Folder Structure

```
sauce-demo/
├── package.json
├── playwright.config.js
├── cucumber.js
├── .env.example
├── README.md
├── environments/
│   ├── qa.env                  # QA: https://www.saucedemo-a.com
│   └── stg.env                 # STG: https://www.saucedemo.com
├── pages/                      # UI Page Objects
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   ├── CheckoutInfoPage.js
│   ├── CheckoutOverviewPage.js
│   └── CheckoutCompletePage.js
├── features/                   # Gherkin feature files
│   ├── login.feature
│   ├── checkout.feature
│   └── api/
│       └── booking.feature
├── ui / steps /
│           ├── login.steps.js
│           ├── checkout.steps.js
|── api/ steps
│       └── booking.steps.js
├── support/                    # World, Hooks, Env loader
│   ├── world.js
│   ├── hooks.js
│   └── env.js
├── utils/
│   └── assertions.js           # Reusable UI assertions
└── reports/                    # Generated reports & screenshots
```

---

## How to install and run the suite

**Requirements:** Node.js 18+, npm

```bash
cd sauce-demo
npm install
npx playwright install chromium
```

| Command | What it does |
|---------|----------------|
| `npm test` | All tests (STG) |
| `npm run test:qa` | All tests (QA) |
| `npm run test:headed` | UI tests with browser visible |
| `npx cucumber-js --tags "@api"` | API tests only |
| `npx cucumber-js --tags "not @api"` | UI tests only |
| `npx run report` | Show Cucumber Report |

Env files live in `environments/` (`qa` / `stg`).  
Reports: `reports/cucumber-report.html`

---

## Which tools you chose and why

| Tool | Role | Why this choice |
|------|------|-----------------|
| **Playwright** | Browser automation + API requests | Fast, reliable auto-waiting, excellent selectors, tracing/screenshots, and a built-in `APIRequestContext` so UI and API tests share one stack. |
| **Cucumber.js** | BDD / Gherkin runner | Closest JS equivalent to SpecFlow. Scenarios stay readable for non-developers and map cleanly to Page Objects / API client methods. |
| **Page Object Model** | UI structure | Separates locators and actions from test logic → easier maintenance when the UI changes. |
| **@faker-js/faker** | Test data | Generates realistic first/last names and zip codes so checkout data is not hardcoded. |
| **dotenv + env files** | Multi-environment | Simple way to switch QA vs STG base URLs and credentials without code changes. ** I want to note that data in each env, I used only the same exact url for environment selection criteria. |
| **cross-env** | Cross-platform scripts | Makes `ENV=…` and `HEADED=…` work the same on Windows/macOS/Linux. |

The primary system under test (SauceDemo) is a classic e-commerce UI demo: login → inventory → cart → checkout. It is UI-heavy, has clear user journeys, and is publicly available, so a UI-focused BDD suite with Page Objects is the natural fit. A small public REST API ([restful-booker.herokuapp.com](https://restful-booker.herokuapp.com)) was added to demonstrate a lightweight API layer alongside the UI tests.

---

## What you tested at the UI layer versus the API layer

### UI layer (SauceDemo)

- Login (happy path + invalid credentials)
- Adding a product to the cart
- The full checkout flow (customer info → overview → confirmation)
- Assertions on URLs, visibility of key elements, confirmation text, and cart/overview item presence

### API layer (Restful Booker)

- `POST /auth` – create authentication token
- `GET /booking/{id}` – retrieve a booking using the token (status 200, fields such as firstname, lastname, totalprice, bookingdates)

### Reasoning for the split

- SauceDemo is intentionally a front-end practice site. The critical user journeys are UI flows; validating them end-to-end through the browser is the highest-value test for that system.
- There is no published, stable public API for SauceDemo that would let us replace UI steps with faster API setup.
- UI tests catch integration issues between pages, JavaScript behaviour, and flow regressions that pure API tests would miss.
- The API examples use Restful Booker so the suite shows how to structure GET calls with Playwright’s `APIRequestContext`, read the base URL from env files, and keep API scenarios browser-free (tagged `@api`).
- With a real application that exposes APIs, the preferred split would be: use API for fast data setup/teardown and auth, and keep UI tests only for journeys that truly need the browser.

---

## What you would add or change with more time

- Faker locales (or random locale) for truly international names
- More UI scenarios (locked-out user, empty cart, remove from cart, product sort)
- Parallel execution (raise `parallel` in `cucumber.js`) with solid isolation
- CI pipeline (e.g. GitHub Actions) with report upload
- Tagging strategy (`@smoke`, `@checkout`, `@api`) and filtered runs
- API coverage beyond GET (POST/PUT/DELETE) and response schema checks using Schema library
- Allure or richer reporting with history
- Validate required env vars at startup; support secrets via CI variables
- Add a YAML file to run in a dedicated CICD platform.

---

## Where you used AI tooling, what you accepted, and what you had to correct or rewrite

| Area | AI contribution | What was accepted | What was corrected / rewritten |
|------|-----------------|-------------------|--------------------------------|
| Project skeleton & folder layout | Suggested Playwright + Cucumber structure | Overall layout, Page Object split, env files | Tightened naming, aligned with SpecFlow-style expectations |
| Page Objects | Generated locator + method stubs | Preferring `data-test` selectors, method names | Brittle locators fixed, explicit `isLoaded` waits, clean `BasePage` inheritance |
| Checkout flow + Faker | Drafted Gherkin scenario and Faker usage | Scenario shape, `faker.person.*` / zip | Stronger assertions (URL, visibility, confirmation text); steps reuse login cleanly |
| Hooks / World | Browser lifecycle sketch | Launch/close per scenario, screenshot on failure | `HEADED` / `DEBUG` flags, baseURL from env, skip browser for `@api`, dispose request context |
| API layer | — | Steps in `step-definitions/api/` using Playwright `request` | Auth token then GET booking; no separate client class; credentials from env |
| package.json & scripts | Initial dependency list | Core packages | Added `@faker-js/faker`, `cross-env`, clear npm scripts |
| README | Outline of structure and commands | Install/run section | Expanded with tool choices, UI vs API reasoning, future work, and AI usage notes |

AI accelerated boilerplate and first drafts. Selectors, assertions, environment switching, API hooks, and final Gherkin wording were reviewed and adjusted so the suite stays stable and matches the requested approach.

---

## How it works

1. **Feature files** describe behaviour in Gherkin.
2. **Step definitions** map steps to Playwright UI actions (Page Objects) or API client methods.
3. **Page Objects** encapsulate locators and interactions.
4. **API steps** live under `step-definitions/api/` and call endpoints directly with Playwright `APIRequestContext` (create token via `POST /auth`, then `GET /booking/{id}` with the token).
5. **World + Hooks** manage browser lifecycle for UI scenarios and a shared `APIRequestContext` for API scenarios (`@api` skips the browser).
6. **Assertions** live in `utils/assertions.js` (UI) and Playwright `expect` (API).

---

## Adding a new Page Object

1. Create `pages/MyNewPage.js` extending `BasePage`.
2. Define locators in the constructor.
3. Add action methods.
4. Instantiate and apply the in the relevant step definitions.

## Adding a new Feature

1. Create `features/my-feature.feature` (or under `features/api/` for API).
2. Write scenarios in Gherkin.
3. Implement the missing steps under `steps/` (or `steps/api/`).

## Notes
- I used BDD style for a readable format and can be implemented in a TDD styling.
