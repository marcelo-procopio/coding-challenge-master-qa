import { Page, expect } from '@playwright/test'

// LoginPage is the reference implementation we expect the InventoryPage refactor to mirror:
// methods describe user intent, selectors stay inside the class, no Locator return values
// leak to specs.
export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  async loginAs(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username').fill(username)
    await this.page.getByTestId('password').fill(password)
    await this.page.getByTestId('login-button').click()
  }

  async expectErrorContaining(text: string): Promise<void> {
    await expect(this.page.getByTestId('error')).toContainText(text)
  }
}
