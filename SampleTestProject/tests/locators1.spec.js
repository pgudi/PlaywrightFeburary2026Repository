const { test, expect } = require("@playwright/test")

test("Inbult Locators in Playwright", async({page})=>{
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.waitForTimeout(3000)
   
    await page.getByPlaceholder("Username").fill("Admin")
    await page.getByPlaceholder("Password").fill("admin123")
    await page.getByRole('button',{type:'submit'}).click()
    await page.waitForTimeout(2000)
    await page.getByAltText("profile picture").first().click()
    await page.getByText("Logout").click()
    await page.waitForTimeout(2000)
})