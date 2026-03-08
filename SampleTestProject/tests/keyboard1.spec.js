const { test, expect } = require('@playwright/test')

test("Handling Keyboard Operation 1", async ({ page }) => {
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    //Login ACtion
    await page.locator('input[name="username"]').fill("pgudi")
    await page.locator('input[name="password"]').fill("pgudi")

    await page.keyboard.press("Enter")
    await page.waitForTimeout(3000)
})