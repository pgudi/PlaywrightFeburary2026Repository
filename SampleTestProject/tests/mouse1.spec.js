const {test, expect} = require('@playwright/test')

test("Perform Mouse Movements", async({page})=>{
    await page.goto("https://www.tirabeauty.com/")
    await page.waitForTimeout(3000)
    await page.locator("//a[text()='Makeup']").first().hover()
    await page.waitForTimeout(3000)
    await page.locator("//a[text()='Foundation']").first().click()
    await page.waitForTimeout(3000)
})