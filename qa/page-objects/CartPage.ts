import { Page, expect } from '@playwright/test'

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectItemPresent(name: string): Promise<void> {
    await expect(this.page.getByTestId('inventory-item-name').getByText(name, { exact: true })).toBeVisible()
  }

  async itemCount(): Promise<number> {
    return this.page.getByTestId('inventory-item').count()
  }

  async checkout(): Promise<void> {
    await this.page.getByTestId('checkout').click()
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Your Information')
  }
}
