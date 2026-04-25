const {test, expect} = require("@playwright/test")

test("Handle Auto Suggestion using Keyboard", async({page})=>{
    await page.goto("https://www.amazon.in/")
    await page.waitForTimeout(3000)
    await page.locator("//input[@id='twotabsearchtextbox']").fill("Smart Phone")
    await page.waitForTimeout(3000)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(1000)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(1000)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(1000)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(1000)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(3000)

})

test.only("Handle Auto Suggestion using Locator", async({page})=>{
    await page.goto("https://www.amazon.in/")
    await page.waitForTimeout(3000)
    await page.locator("//input[@id='twotabsearchtextbox']").fill("Smart Phone")
    await page.waitForTimeout(3000)
    await page.waitForSelector("//div[@role='row']/div/div")
    const items =await page.$$("//div[@role='row']/div/div")
    for(let i=0;i<items.length;i++){
        const itemname=await items[i].textContent()
        console.log("Item Name :"+itemname);
        
        if(itemname.includes("smart phone under 6000")){
            await items[i].click()
            break
        }
    }
    await page.waitForTimeout(3000)
})
