const {test, expect} = require("@playwright/test")

test("Import single File Testcase ", async({page})=>{
    await page.goto("https://the-internet.herokuapp.com/upload")
    await page.waitForTimeout(3000)
    await page.locator("//input[@id='file-upload']").setInputFiles("C:/Users/prabh/Downloads/Client_Server_Architecture1.jpg")
    await page.waitForTimeout(1000)
    await page.locator("//input[@id='file-submit']").click()
    await page.waitForTimeout(2000)
    await expect(await page.locator("//h3").textContent()).toContain("File Uploaded!")
    await page.waitForTimeout(2000)
})

test.only("Import single File Testcase using relative Path ", async({page})=>{
    await page.goto("https://the-internet.herokuapp.com/upload")
    await page.waitForTimeout(3000)
    await page.locator("//input[@id='file-upload']").setInputFiles("./uploads/Client_Server_Architecture1.jpg")
    await page.waitForTimeout(1000)
    await page.locator("//input[@id='file-submit']").click()
    await page.waitForTimeout(2000)
    await expect(await page.locator("//h3").textContent()).toContain("File Uploaded!")
    await page.waitForTimeout(2000)
})