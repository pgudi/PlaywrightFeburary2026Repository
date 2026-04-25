const {test, expect} = require('@playwright/test')
const logindata = require('./../datafiles/logindata.json')
const data = require('./../datafiles/multilogindata.json')

test("Login and Logout using JSON Parametrization", async({page})=>{
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    await page.locator('input[name="username"]').fill(logindata.username)
    await page.locator('input[name="password"]').fill(logindata.password)
    await page.locator("//button[normalize-space()='Sign In']").click()
    await page.waitForTimeout(3000)
    await page.locator("//button[normalize-space()='Logout']").click()
    await page.waitForTimeout(2000)
})

test.only("Multiple Login and Logout using JSON Parametrization", async({page})=>{
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    for(let logindata of data){
        await page.locator('input[name="username"]').fill(logindata.username)
        await page.locator('input[name="password"]').fill(logindata.password)
        await page.locator("//button[normalize-space()='Sign In']").click()
        await page.waitForTimeout(3000)
        await page.locator("//button[normalize-space()='Logout']").click()
        await page.waitForTimeout(2000)
    }
})