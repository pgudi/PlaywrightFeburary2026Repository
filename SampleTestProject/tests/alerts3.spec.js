const {test, expect} = require('@playwright/test')

test("Handling the Simple Alerts", async({page})=>{
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    await page.waitForTimeout(3000)

    await page.on("dialog", async(dialog)=>{
        expect (dialog.type()).toContain("prompt")
        const alertMessage=await dialog.message()
        console.log("Alert Message :"+alertMessage);
        await dialog.accept("WELCOME PLAYWRIGHT TOOL")
        
    })

    await page.waitForTimeout(3000)
    await page.locator("//button[normalize-space()='Click for JS Prompt']").click()
    await page.waitForTimeout(3000)
    const statusMessage=await page.locator("#result").textContent()
    console.log("Status Message Alert :"+statusMessage);
    
})