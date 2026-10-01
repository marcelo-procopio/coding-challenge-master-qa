import { Page, expect } from '@playwright/test'

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.getByTestId('firstName').fill(firstName)
    await this.page.getByTestId('lastName').fill(lastName)
    await this.page.getByTestId('postalCode').fill(postalCode)
    await this.page.getByTestId('continue').click()
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Overview')
  }

  async finish(): Promise<void> {
    await this.page.getByTestId('finish').click()
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.page.getByTestId('complete-header')).toContainText('Thank you for your order')
  }

  async expectItem(name: string): Promise<void> {
    await expect(this.page.getByTestId('inventory-item-name').getByText(name, { exact: true })).toBeVisible()
  }

  async expectTotalEqualsSubtotalPlusTax(): Promise<void> {
    const subtotal = await this.money('subtotal-label')
    const tax = await this.money('tax-label')
    const total = await this.money('total-label')
    const subtotalCents = toCents(subtotal)
    const taxCents = toCents(tax)
    const totalCents = toCents(total)
    expect(
      totalCents,
      `displayed total ${total} !== subtotal ${subtotal} + tax ${tax}`,
    ).toBe(subtotalCents + taxCents)
  }

  private async money(testId: string): Promise<number> {
    const text = (await this.page.getByTestId(testId).innerText()).trim()
    const match = text.match(/\$(\d+\.\d{2})/)
    if (!match) {
      throw new Error(`Could not parse a dollar amount from ${testId}: "${text}"`)
    }
    return Number.parseFloat(match[1])
  }
}

function toCents(amount: number): number {
  return Math.round(amount * 100)
}
