const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/login`);
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.trendsSection = page.locator('[data-testid="trends-section"]');
    this.newsFeed = page.locator('[data-testid="news-feed"]');
    this.userMenu = page.locator('[data-testid="user-menu"]');
    this.navBar = page.locator('[data-testid="nav-bar"]');
  }

  async waitForLoad() {
    await this.page.waitForURL('**/dashboard');
    await expect(this.trendsSection).toBeVisible({ timeout: 10000 });
  }
}

class TrendsPage {
  constructor(page) {
    this.page = page;
    this.trendsList = page.locator('[data-testid="trends-list"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.filterButtons = page.locator('[data-testid="filter-button"]');
  }

  async goto() {
    await this.page.goto(`${BASE_URL}/trends`);
  }

  async search(query) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async filterByCategory(category) {
    await this.filterButtons.filter({ hasText: category }).click();
  }
}

test.describe('Login Flow', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form', async ({ page }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.login('invalid@test.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should login and redirect to dashboard', async ({ page }) => {
    await loginPage.login('admin@atin.dev', 'Admin123!@#');
    await expect(page).toHaveURL('**/dashboard', { timeout: 10000 });
  });
});

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@atin.dev', 'Admin123!@#');
  });

  test('should display dashboard components', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.waitForLoad();
    await expect(dashboard.trendsSection).toBeVisible();
    await expect(dashboard.newsFeed).toBeVisible();
  });

  test('should navigate to trends page', async ({ page }) => {
    await page.locator('[data-testid="nav-trends"]').click();
    await expect(page).toHaveURL('**/trends');
  });

  test('should navigate to news page', async ({ page }) => {
    await page.locator('[data-testid="nav-news"]').click();
    await expect(page).toHaveURL('**/news');
  });
});

test.describe('Trend Exploration', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@atin.dev', 'Admin123!@#');
  });

  test('should display trends list', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    await trendsPage.goto();
    await expect(trendsPage.trendsList).toBeVisible({ timeout: 10000 });
    const items = trendsPage.trendsList.locator('[data-testid="trend-item"]');
    expect(await items.count()).toBeGreaterThan(0);
  });

  test('should search for a technology', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    await trendsPage.goto();
    await trendsPage.search('GPT');
    await expect(trendsPage.trendsList).toBeVisible();
  });

  test('should open trend detail', async ({ page }) => {
    const trendsPage = new TrendsPage(page);
    await trendsPage.goto();
    await page.locator('[data-testid="trend-item"]').first().click();
    await expect(page.locator('[data-testid="trend-detail"]')).toBeVisible({ timeout: 10000 });
  });
});
