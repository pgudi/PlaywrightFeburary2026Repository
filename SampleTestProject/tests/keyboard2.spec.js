const { test, expect } = require('@playwright/test')

test("Handling Keyboard Operation 2", async ({ page }) => {
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    //Login ACtion
    await page.keyboard.press("Tab")
    await page.keyboard.type("pgudi")
    await page.keyboard.press("Tab")
    await page.keyboard.type("pgudi")
    await page.keyboard.press("Enter")
    await page.waitForTimeout(3000)
})