const {test, expect} = require('@playwright/test')

test("Fetch Text Content from WebElements ", async({page})=>{
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.waitForTimeout(3000)
    //Fetch Login Details
    const username=await page.locator("(//p[@class='oxd-text oxd-text--p'])[1]").textContent()
    console.log("User Name :"+username);
    
    const password = await page.locator("(//p[@class='oxd-text oxd-text--p'])[2]").textContent()
    console.log("Password :"+password);
    
    //Invalid Credetials
    await page.locator('[name="username"]').fill("Admin")
    await page.locator('[name="password"]').fill("12345")
    await page.locator('button:has-text("Login")').click()

    const errorContent = await page.locator(':text("Invalid credentials")').textContent()
    console.log("Error Message :"+errorContent);
    
    await expect(errorContent).toContain("Invalid")
})