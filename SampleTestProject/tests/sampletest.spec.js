const {test, expect} = require('@playwright/test')

test("Launch nad Navigate URL and Capture Title and URL", async({page})=>{
    await page.goto("https://www.w3schools.com/")
    await page.waitForTimeout(3000)
    const browserTitle = await page.title()
    console.log("Brwoser title :"+browserTitle);
    const browserURL= await page.url()
    console.log("Browser URL :"+browserURL)

})