const {test, expect} = require("@playwright/test")

test("Handle View Port first approach", async({page})=>{
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    const height1=await page.viewportSize().height
    console.log("View Port Height :"+height1);
    const width1=await page.viewportSize().width
    console.log("View Port Width :"+width1);
    await page.waitForTimeout(3000)
    await page.locator('input[name="username"]').fill("pgudi")
    await page.locator('input[name="password"]').fill("pgudi")
    await page.locator("//button[normalize-space()='Sign In']").click()
    await page.waitForTimeout(3000)
    await page.locator("//button[normalize-space()='Logout']").click()
    await page.waitForTimeout(2000)

})