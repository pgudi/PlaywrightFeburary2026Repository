const {test, expect} = require('@playwright/test')

test("Identify Elements based on Attribute Name and Value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    const userName=await page.$("id=uid1user1name1")
    await userName.fill("DemoUser1")
    const password=await page.$("id=pwd1pass1word1")
    await password.fill("Welcome12345")
    //click on checkbox
    const windows=await page.$("id=chk1windows")
    windows.click()
    await page.waitForTimeout(3000)
})