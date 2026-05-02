import {test, expect} from '@playwright/test'

test("Login and Logout Testcase",async({page})=>{
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    const title:string=await page.title()
    console.log("Title :"+title);
    const url:string=await page.url()
    console.log("URL :"+url);
    //Login Action
    await page.locator('input[name="username"]').fill("pgudi")
    await page.locator('input[name="password"]').fill("pgudi")
    await page.locator("//button[normalize-space()='Sign In']").click()
    await expect(page).toHaveTitle("S G Software Testing Institute")
    await page.waitForTimeout(3000)
    //Logout Action
    await page.locator("//button[normalize-space()='Logout']").click()
    await expect(page).toHaveTitle("S G Software Testing Institute")
    await page.waitForTimeout(3000)
})