const {test, expect} = require ('@playwright/test')
test("login create employee, delete employee and logout", async({page}) => {
await page.goto("https://sgtestinginstituteapp.onrender.com/")
await page.waitForTimeout(3000)
await
await page.locator('input[name="username"]').fill("pgudi")
await page.locator('input[name="password"]').fill("pgudi")
await page.locator("//button[normalize-space()='Sign In']").click()
await page.waitForTimeout(2000)
await page.locator(':text("Employees")').click()
await page.locator(':text-is("Add Employee")').click()
await page.waitForTimeout(3000)
await page.locator("//input[@placeholder='Enter First Name']").fill("Ravi")
// await page.locator(':text-is("Save")').click()
await page.waitForTimeout(2000)
})
 