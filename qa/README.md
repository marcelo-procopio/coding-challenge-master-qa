innosabi engineer QA challenge
==============================

Welcome. This take-home evaluates how you design Playwright tests, debug failures, and structure a small test suite. We care more about *how* you reason than checkbox completeness.

## Time budget

**Plan for 3 hours.** If you blow past that, stop and document what you would have done next in `NOTES.md`. We do not reward gold-plating; we do reward clear thinking.

## Setup (5 minutes)

The challenge target is **Sauce Demo** — a public e-commerce demo: <https://www.saucedemo.com>. Login credentials are listed on the login page itself (use `standard_user` for happy paths, `problem_user` and `error_user` to surface edge cases).

Get the starter running:

```bash
cd qa
npm install
npx playwright install chromium    # on Linux, append --with-deps for system libs
npm test                            # runs all specs (some fail on purpose — that is the exercise)
npm run test:headed                 # same, with browser visible
```

You should see one passing test (the smoke test) and four failing tests — those are your starting points.

## What you will deliver

A single ZIP (or public Git repo link) containing:

1. The `qa/` folder with your changes.
2. `NOTES.md` (half a page max).
3. A 2-minute screen recording is *optional*; do not invest more than 5 minutes if you make one.

Do **not** include `node_modules/` or `playwright-report/` in your submission.

## The four tasks

You will not finish all four cleanly in 3 hours. Triage. Pick the order that lets you ship the strongest narrative in `NOTES.md`.

### Task 1 — Make the smoke test green (15 min)

`tests/smoke.spec.ts` already passes. Read it. This is your reference for how we expect a test to look: page object, no hard sleeps, one logical assertion per `expect`. Nothing to do here besides understanding the pattern.

### Task 2 — Fix the broken tests (60 min)

Three tests under `tests/inventory.spec.ts` fail. **Each fails for a different reason.** Diagnose each one, decide whether the bug is in the *test* or in your understanding of the *site*, and fix it. The site itself is stable — we did not modify Sauce Demo. Any "bug" is in the test code or its interaction with the site.

For each test you touch, add a one-line comment above explaining what the actual problem was. Example:
```ts
// Was waiting for the wrong selector — cart badge only renders after the first add.
```

### Task 3 — Refactor `page-objects/InventoryPage.ts` (45 min)

The page object compiles and works, but it has at least five design issues a senior reviewer would flag in code review. Refactor it. We are looking for:

- Methods named after **user intent**, not selectors.
- No leaking implementation details (no `Locator` returns to the spec layer unless it is genuinely necessary, and the `page` field should not be reachable from outside).
- **Selector hygiene** — apply the same rule the README sets for your own code (`data-test` first, semantic roles second, CSS last). The existing scaffold does not follow this rule; that is part of what you are fixing.
- Consistent error handling — what happens if you `addToCart('nonexistent product')`?
- No duplicated selectors.

Update the specs that consume the page object to use your improved API. **Do not** introduce a base class or framework — keep it idiomatic Playwright.

### Task 4 — Diagnose the flaky test (30 min)

We flagged `tests/checkout.spec.ts > completes a checkout with one item` as **intermittently failing in CI**. Reproduce it locally and diagnose:

```bash
npm run test:flaky        # runs the suspect test 10 times serially
```

The site is stable — the bug is in our test. Find what's actually wrong, fix it, and write 2–3 sentences in `NOTES.md` explaining your diagnosis process: what you tried first, what the actual cause was, and why your fix is correct (not just "it works now"). **We grade the reasoning more than the fix.** If the symptom you see does not match the way we framed the problem, say so — that itself is signal.

### Task 5 — Optional, only if you are ahead of schedule (30 min)

Add **one** new test that you think the existing suite is missing. Your choice of feature. In `NOTES.md`, justify why that test was the highest-value addition.

## What goes in `NOTES.md`

Keep it tight. Bullet points are fine.

- For Task 2, a one-line summary per fix is enough.
- For Task 3, list the issues you found and which you fixed (and which you left, with a reason).
- For Task 4, the diagnosis story (2–3 sentences) is the deliverable. Be honest about dead-ends.
- For Task 5 (if you did it), the justification.
- One thing about the Sauce Demo UI that surprised you. Good signal: you noticed `problem_user` swaps product images, the cart persists across logins, the sort does not reset on refresh, etc.

## Constraints

- **No `waitForTimeout` / fixed sleeps anywhere.** Use auto-waiting locators or `expect(...).toBeVisible()`.
- **TypeScript strict mode** stays on. No `any`.
- **Test isolation:** every test must pass when run alone (`npx playwright test tests/foo.spec.ts -g "test name"`).
- **`data-test=...` attributes first.** Sauce Demo provides them; use them. Fall back to roles, then text, then CSS — in that order. Never query by class name unless there is genuinely no alternative.

## How we evaluate

| Signal | What we look for |
|---|---|
| Test design | Each test has one reason to fail; failure messages tell us what broke |
| Selector hygiene | `data-test` first, semantic roles second, CSS last |
| Wait strategy | Auto-waiting locators; right-sized timeouts; no `waitForTimeout` |
| Page Object design | Methods describe intent; selectors stay in the page object |
| Debugging reasoning | Your `NOTES.md` shows how you think, not just what you typed |
| Self-awareness | You triaged and shipped the strongest tasks; you said what you would have done next |

We do **not** evaluate:

- Whether you finished all five tasks
- Whether you wrote a custom test runner / framework / BDD wrapper (please don't)
- Number of tests beyond what we asked
- CI configuration unless you swap it for one of the tasks (your call, document it)

Good luck.
