const {test, expect} = require('@playwright/test');

test("Login into The Application", async({page})=>{
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.waitForTimeout(3000)
    const title=await page.title()
    await expect(title==="OrangeHRM").toBeTruthy()
    await expect(title.includes("Orange")).toBeTruthy()
    await expect(title).toContain("Orange")
    await expect(page).toHaveTitle("OrangeHRM")

})