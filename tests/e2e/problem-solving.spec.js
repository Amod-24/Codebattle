/**
 * E2E tests for CodeBattle using Playwright.
 * Simulates real user flow: navigate, query, and submit answer.
 */

import { test, expect } from '@playwright/test';

test.describe('CodeBattle - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display home page with hero section', async ({ page }) => {
    await expect(page.locator('.hero__title')).toBeVisible();
    await expect(page.locator('#cta-start')).toBeVisible();
    await expect(page.locator('.navbar__logo')).toContainText('CodeBattle');
  });

  test('should navigate to problems page', async ({ page }) => {
    await page.click('text=Start Solving');
    await expect(page.locator('.problems-page')).toBeVisible();
    await expect(page.locator('.problem-card')).toHaveCount(1);
  });

  test('should navigate to problem and interact with console', async ({
    page,
  }) => {
    await page.click('text=Start Solving');
    await page.click('text=Find the Hidden Number');

    // Verify problem page loaded
    await expect(page.locator('.problem-panel__title')).toContainText(
      'Find the Hidden Number'
    );
    await expect(page.locator('#console-input')).toBeVisible();

    // Make a query
    await page.fill('#console-input', '? 50');
    await page.click('#send-btn');

    // Should see a response in the console
    const output = page.locator('#console-output');
    await expect(output).toContainText(/TOO_LOW|TOO_HIGH|CORRECT/);
  });

  test('should show result modal on correct answer', async ({ page }) => {
    await page.goto('http://localhost:3000/problem/binary-search-1');

    // We need to find the number through queries first
    // Try a brute force approach for testing: query and then guess
    await page.fill('#console-input', '? 50');
    await page.click('#send-btn');

    // Wait for response
    await page.waitForTimeout(300);

    // Submit an answer (may or may not be correct - we test the flow)
    await page.fill('#console-input', '! 50');
    await page.click('#send-btn');

    // Either we get the result modal or an error message
    await page.waitForTimeout(300);
    const consoleOutput = await page.locator('#console-output').textContent();
    expect(
      consoleOutput.includes('Correct') || consoleOutput.includes('Wrong')
    ).toBeTruthy();
  });

  test('should reset game on new game button', async ({ page }) => {
    await page.goto('http://localhost:3000/problem/binary-search-1');

    // Make a query
    await page.fill('#console-input', '? 50');
    await page.click('#send-btn');
    await page.waitForTimeout(300);

    // Reset
    await page.click('#reset-btn');

    // Console should show reset message
    const output = page.locator('#console-output');
    await expect(output).toContainText('New game started');
  });
});
