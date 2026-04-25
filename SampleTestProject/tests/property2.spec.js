const {test, expect} = require('@playwright/test')

test("Identify Elements based on Attribute Name and Value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.fill("id=uid1user1name1","demoUser1")
    await page.fill("id=pwd1pass1word1","demoPassword1")
    await page.click("id=chk1windows")
    await page.waitForTimeout(3000)
})