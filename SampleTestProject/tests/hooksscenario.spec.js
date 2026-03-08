const { test, expect } = require('@playwright/test')
let page;
let context;
test.beforeAll(async({browser})=>{
    context = await browser.newContext()
    page = await context.newPage()
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.waitForTimeout(3000)
})

test.afterAll(async()=>{
    await page.close()
    await context.close()
})

test("1 Login valid credentials", async () => {
    
    //Login Action
    await page.locator('[name="username"]').fill("Admin")
    await page.locator('[name="password"]').fill("admin123")
    await page.locator('button:has-text("Login")').click()

    await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index")
    await page.waitForTimeout(3000)
})

test("2 Logout from Application", async () => {
    await page.locator('img.oxd-userdropdown-img:visible').click()
    await page.locator("//a[normalize-space()='Logout']").click()
    await expect(page).toHaveURL("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    await page.waitForTimeout(3000)
})


