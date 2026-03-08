const { test, expect } = require("@playwright/test")

test("Handling Keyboard Operation 4", async ({ page }) => {
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    await page.locator('input[name="username"]').fill("Hello World!")
    await page.keyboard.press('ArrowLeft');

    await page.keyboard.down('Shift');
    for (let i = 0; i < ' World'.length; i++){
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(1000)
    }   
    await page.keyboard.up('Shift');

    await page.keyboard.press('Backspace');
    await page.waitForTimeout(3000)
})