const { test, expect } = require('@playwright/test')

test("Handling Keyboard Operation3", async({page})=>{
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    //Login ACtion
    await page.locator('input[name="username"]').fill("WELCOME PLAYWRIGHT")
    await page.keyboard.press("Control+A")
    await page.waitForTimeout(2000)
    await page.keyboard.press("Control+X")
    await page.waitForTimeout(2000)
    await page.keyboard.press("Control+V")
    await page.waitForTimeout(2000)
})