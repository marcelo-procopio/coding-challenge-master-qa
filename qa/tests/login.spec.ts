import { test } from '@playwright/test'

import { LoginPage } from '../page-objects/LoginPage'

test.describe('Login', () => {
  test('locked_out_user sees the lockout error', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.loginAs('locked_out_user', 'secret_sauce')
    await loginPage.expectErrorContaining('Sorry, this user has been locked out')
  })
})
