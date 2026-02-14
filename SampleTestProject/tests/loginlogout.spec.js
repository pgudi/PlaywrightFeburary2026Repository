const {test, expect} = require('@playwright/test');

test("Login into The Application", async({page})=>{
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    const title=await page.title()
    await expect(title==="OrangeHRM").toBeTruthy()
    await expect(title.includes("Orange")).toBeTruthy()
    await expect(title).toContain("Orange")
    await expect(page).toHaveTitle("OrangeHRM")
    await page.locator("//input[@name='username']").fill("Admin")
    await page.locator("//input[@name='password']").fill("admin123")
    await page.locator("//button[@type='submit']").click()
    await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index")
    //Logout Action
    await page.locator("//img[@class='oxd-userdropdown-img']").click()
    await page.locator("//a[normalize-space()='Logout']").click()
    await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    

})