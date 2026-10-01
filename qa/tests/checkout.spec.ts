import { test } from '@playwright/test'

import { CartPage } from '../page-objects/CartPage'
import { CheckoutPage } from '../page-objects/CheckoutPage'
import { InventoryPage } from '../page-objects/InventoryPage'
import { LoginPage } from '../page-objects/LoginPage'

// Task 4: 9.99 + 0.80 is 10.790000000000001 in IEEE-754, so toEqual never matched the displayed 10.79.
// Compared in cents instead. See NOTES.md.

test.describe('Checkout', () => {
  test('completes a checkout with one item', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventory = new InventoryPage(page)
    const cart = new CartPage(page)
    const checkout = new CheckoutPage(page)

    await loginPage.goto()
    await loginPage.loginAs('standard_user', 'secret_sauce')
    await inventory.expectLoaded()
    await inventory.addToCart('Sauce Labs Bike Light')
    await inventory.openCart()
    await cart.expectItemPresent('Sauce Labs Bike Light')
    await cart.checkout()
    await checkout.fillInformation('Ada', 'Lovelace', '10115')
    await checkout.expectItem('Sauce Labs Bike Light')
    await checkout.expectTotalEqualsSubtotalPlusTax()
    await checkout.finish()
    await checkout.expectOrderComplete()
  })
})
