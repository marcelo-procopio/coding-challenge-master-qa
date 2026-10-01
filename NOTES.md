# Notes

All of this was done by AI in Cursor Pro. Playwright MCP drove Sauce Demo in the browser to confirm each failure. A video will explain the concepts.

Market practice used here: page objects named for the user action, `data-test` before role before text, auto-waiting locators, no fixed sleeps, one reason to fail per test, and money checked in cents so `9.99 + 0.80` cannot fail a correct total.

## Task 2

- Cart badge: two adds, assertion expected `"1"`. The badge was `2`.
- Sort: `parseFloat("$7.99")` is `NaN`, and the prices were fetched by product name, so the check never looked at order. It now waits until the first card is Sauce Labs Onesie ($7.99).
- `error_user`: Remove throws `Failed to remove item from cart.` and the badge stays at 1. The test expected a successful remove.

## Task 3

Fixed in `InventoryPage`: public `page`; `waitForTimeout(500)`; `getItemByName()` returning a `Locator`; click/selector method names; repeated `.inventory_item` / class selectors (now `data-test`); `getCartBadgeText()` returning `''` with no wait; `getItemPriceText()` leaking the `$`. A missing product fails with the name in the message. No base class. Specs call `addToCart`, `sortBy`, `expectCartCount`, `openCart`.

## Task 4

`npm run test:flaky` failed 10/10 with the same assertion, not a mix of pass/fail. Expected `10.790000000000001`, received `10.79`. Bike Light is $9.99 and tax is $0.80; `9.99 + 0.80` is not `10.79` in IEEE-754, and `toEqual` compared that sum to the parsed label. The fix compares integer cents (`Math.round(n * 100)`), which is what the two-decimal labels mean. The overview must also show the bike light: an empty cart is `0 + 0 === 0` and would have passed the old check.

Dead end: `waitForURL('**/cart.html')` resolves while the title still says Products (the URL changes before React paints). I thought the `waitForTimeout` in `navigate()` was hiding a missed cart click. That race is real, and `openCart()` now waits for "Your Cart", but it was not this failure — the summary had the bike light on every run.

`npm run test:flaky` also matched nothing under cmd.exe, because the single-quoted `-g` value is split. The script now uses double quotes.

## Task 5

`locked_out_user` is printed on the login page and nothing in the suite covered a rejected login.

## Surprise

`error_user` does not quietly ignore Remove — it throws a page error and leaves the item in the cart.

## Next

- `problem_user` swaps product images.
- Checkout blocks an empty required field.
- `standard_user` can remove an item. Only the broken `error_user` path is covered.
- Same session: the cart is still there after a refresh.
