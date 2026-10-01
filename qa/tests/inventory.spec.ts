import { test, expect } from '@playwright/test'

import { InventoryPage } from '../page-objects/InventoryPage'
import { LoginPage } from '../page-objects/LoginPage'

// Task 2: each of these tests fails for a different reason. Diagnose, fix, and add a one-line
// comment above each test explaining what was actually wrong. The site is stable — Sauce Demo
// works fine; bugs are in the test code or in our understanding of the product behavior.

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.loginAs('standard_user', 'secret_sauce')
  })

  // Two items were added, but the assertion expected a badge of "1".
  test('adds two items and the cart badge reads the correct count', async ({ page }) => {
    const inventory = new InventoryPage(page)
    await inventory.expectLoaded()
    await inventory.addToCart('Sauce Labs Backpack')
    await inventory.addToCart('Sauce Labs Bike Light')
    await inventory.expectCartCount(2)
  })

  // Price text is "$7.99", so parseFloat was NaN — and looking items up by name never checked order.
  test('sorting by price (low to high) puts the cheapest item first', async ({ page }) => {
    const inventory = new InventoryPage(page)
    await inventory.expectLoaded()
    await inventory.sortBy('price-asc')
    await inventory.expectItemAt(0, 'Sauce Labs Onesie')
  })
})

test.describe('Inventory · error_user', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.loginAs('error_user', 'secret_sauce')
  })

  // error_user throws "Failed to remove item from cart." and the badge stays at 1.
  test('error_user cannot remove an item from the cart', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (error) => {
      pageErrors.push(error.message)
    })

    const inventory = new InventoryPage(page)
    await inventory.expectLoaded()
    await inventory.addToCart('Sauce Labs Backpack')
    await inventory.expectCartCount(1)
    await inventory.removeFromCart('Sauce Labs Backpack')
    await inventory.expectCartCount(1)
    expect(pageErrors).toContain('Failed to remove item from cart.')
  })
})
