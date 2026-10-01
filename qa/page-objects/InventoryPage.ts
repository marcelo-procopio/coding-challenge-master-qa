import { Locator, Page, expect } from '@playwright/test'

const sortOption = {
  'name-asc': 'az',
  'name-desc': 'za',
  'price-asc': 'lohi',
  'price-desc': 'hilo',
} as const

export type InventorySort = keyof typeof sortOption

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/inventory.html')
    await this.expectLoaded()
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByTestId('title')).toHaveText('Products')
    await expect(this.page.getByTestId('inventory-container')).toBeVisible()
  }

  async addToCart(name: string): Promise<void> {
    await expect(this.item(name), `No inventory item named "${name}"`).toBeVisible()
    const addButton = this.item(name).getByTestId(`add-to-cart-${slug(name)}`)
    await expect(addButton, `"${name}" has no Add to cart button`).toBeVisible()
    await addButton.click()
  }

  async removeFromCart(name: string): Promise<void> {
    await expect(this.item(name), `No inventory item named "${name}"`).toBeVisible()
    const removeButton = this.item(name).getByTestId(`remove-${slug(name)}`)
    await expect(removeButton, `"${name}" has no Remove button`).toBeVisible()
    await removeButton.click()
  }

  async expectCartCount(count: number): Promise<void> {
    const badge = this.page.getByTestId('shopping-cart-badge')
    if (count === 0) {
      await expect(badge).toHaveCount(0)
      return
    }
    await expect(badge).toHaveText(String(count))
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click()
    // The URL flips to /cart.html before React swaps the view. Wait for the cart title.
    await expect(this.page.getByTestId('title')).toHaveText('Your Cart')
  }

  async sortBy(order: InventorySort): Promise<void> {
    await this.page.getByTestId('product-sort-container').selectOption(sortOption[order])
  }

  async expectItemAt(index: number, name: string): Promise<void> {
    await expect(this.page.getByTestId('inventory-item-name').nth(index)).toHaveText(name)
  }

  async expectItemVisible(name: string): Promise<void> {
    await expect(this.item(name), `No inventory item named "${name}"`).toBeVisible()
  }

  private item(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    })
  }
}

function slug(name: string): string {
  return name.toLowerCase().replaceAll(' ', '-')
}
