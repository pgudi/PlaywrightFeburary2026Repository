const {test, expect} = require('@playwright/test')

test("Handling the Simple Alerts", async({page})=>{
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    await page.waitForTimeout(3000)

    await page.on("dialog", async(dialog)=>{
        expect (dialog.type()).toContain("confirm")
        const alertMessage=await dialog.message()
        console.log("Alert Message :"+alertMessage);
        await dialog.dismiss()
        
    })

    await page.waitForTimeout(3000)
    await page.locator("//button[normalize-space()='Click for JS Confirm']").click()
    await page.waitForTimeout(3000)
    const statusMessage=await page.locator("#result").textContent()
    console.log("Status Message Alert :"+statusMessage);
    
})