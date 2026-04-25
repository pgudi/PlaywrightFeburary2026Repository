const {test, expect} = require('@playwright/test')

test("Handle Tabbed Brwosers", async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("http://localhost/login.do")
    await page.waitForTimeout(3000)

    const [newPage]=await Promise.all(
        [
            context.waitForEvent("page"),
            page.locator("//a[text()='actiTIME Inc.']").click()
        ]
    )

    await newPage.waitForTimeout(3000)
    await newPage.locator("//a[text()='Log in']").click()
    await newPage.waitForTimeout(2000)
    await newPage.locator("//input[@id='Enteryouremail']").fill("santosh@gmail.com")
    await newPage.waitForTimeout(2000)
    await newPage.close()
    await page.locator("//input[@id='username']").fill("WelcomeUser")
    await page.waitForTimeout(2000)
})