import { test, expect } from '@playwright/test'

import { LoginPage } from '../page-objects/LoginPage'

// This is the reference test. It passes. Use it as a template for what we expect:
// - Page object encapsulates selectors
// - Locators auto-wait, no `waitForTimeout`
// - One logical thing per `expect`
test.describe('Smoke', () => {
  test('standard_user can log in and lands on the inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.loginAs('standard_user', 'secret_sauce')
    await expect(page).toHaveURL(/inventory\.html$/)
    await expect(page.getByTestId('title')).toHaveText('Products')
  })
})
