const {test, expect} = require('@playwright/test')

test("Handle Drop Down Items", async ({page})=>{
    await page.goto("file:///C:/Example/Sample.html")
    await page.waitForTimeout(3000)

    await page.locator("#tools").selectOption({label:'Selenium WebDriver'})
    await page.waitForTimeout(3000)
    await page.locator("#tools").selectOption({value:'rc'})
    await page.waitForTimeout(3000)
    await page.locator("#tools").selectOption({index:1})
    await page.waitForTimeout(3000)

})