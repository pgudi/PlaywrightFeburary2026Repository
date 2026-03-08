const { test, expect } = require("@playwright/test")

test("Handling Alert during Delete Customer", async ({ page }) => {
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(2000)
    //Login into Application
    await page.locator('input[name="username"]').fill("pgudi")
    await page.locator('input[name="password"]').fill("pgudi")
    await page.locator("//button[normalize-space()='Sign In']").click()
    await page.waitForTimeout(2000)
    //Home Page Actions
    await page.locator("//a[normalize-space()='Customers']").click()
    await page.locator("//a[normalize-space()='Add Customer']").click()
    await page.waitForTimeout(2000)
    await page.locator("//input[@placeholder='Enter Customer Name']").fill("Reliance")
    await page.locator("//input[@placeholder='Enter EmailId']").fill("support@reliance.com")
    await page.locator("//input[@placeholder='Enter Location']").fill("Bangalore")
    await page.locator("//input[@placeholder='Enter Description']").fill("Supports on Oil and Gas")
    await page.locator("//button[normalize-space()='Save']").click()
    const customerName=await page.locator("//td[text()='Reliance']").textContent()
    await expect(customerName).toContain("Reliance")
    await page.waitForTimeout(2000)
    await page.on("dialog", async (dialog) => {
        const message = await dialog.message()
        console.log("Alert Message :" + message);
        await dialog.accept()

    })

    await page.locator("//td[text()='Reliance']/following-sibling::td/following-sibling::td/following-sibling::td/following-sibling::td/button[2]").click()
    await page.waitForTimeout(2000)

})