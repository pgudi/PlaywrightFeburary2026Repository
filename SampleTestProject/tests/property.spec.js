const {test, expect} = require('@playwright/test')

test("Identify Elementsbased on Attribute Name and Value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    // await page.locator("id=uid1user1name1").fill("DemoUser1")
    // await page.locator("name=user1name1").fill("DemoUser1")
    await page.locator("class=user1name1").fill("DemoUser1")
    await page.waitForTimeout(2000)
})