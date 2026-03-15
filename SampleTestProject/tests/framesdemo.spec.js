const {test, expect} = require('@playwright/test')

test("Handling Frames Testcase", async({page})=>{
    await page.goto("https://docs.oracle.com/javase/8/docs/api/")
    await page.waitForTimeout(3000)
    //click on Packages
    const oFrame=await page.frameLocator("//frame[@name='packageListFrame']")
    await oFrame.locator("//a[normalize-space()='java.applet']").click()
    await page.waitForTimeout(5000)
    //Second Frmae
    const oFrame2=await page.frameLocator("//frame[@name='packageFrame']")
    await oFrame2.locator("//span[normalize-space()='AppletContext']").click()
    await page.waitForTimeout(5000)
    //Capture Text content in Third Frame
    const oFrame3= await page.frameLocator("//frame[@name='classFrame']")
    const content=await oFrame3.locator("div[class='description'] li[class='blockList']").textContent()
    console.log(content);
    


})