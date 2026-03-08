const {test, expect} = require('@playwright/test')

test('Login and Logout Functioanlity', async({page})=>{
    //Navigate URL
    await page.goto("http://localhost/login.do")
    await page.waitForTimeout(3000)
    //Login Action
    await page.locator('#username').fill("admin")
    await page.locator('[name="pwd"]').fill("manager")
    await page.locator("//div[normalize-space()='Login']").click()
    await page.waitForTimeout(3000)
    //Home Page
    await page.locator("//div[@id='gettingStartedShortcutsPanelId']").click()
    await page.locator(':text-is("Logout")').click()
    await page.waitForTimeout(3000)
})