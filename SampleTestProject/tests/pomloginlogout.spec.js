const {test, expect} = require('@playwright/test')
const {LoginPage} = require('./../pages/LoginPage')
const {HomePage} = require('./../pages/homePage')

test("Login and Logout Functionality", async({page})=>{
    await page.goto("https://sgtestinginstituteapp.onrender.com/")
    await page.waitForTimeout(3000)
    //Create object for LoginPage
    let loginPage = new LoginPage(page)

    // Create object for Home Page
    let homePage = new HomePage(page)

    //Action on Login and Logout
    await loginPage.setUserName("pgudi")
    await loginPage.setPassword("pgudi")
    await loginPage.clickOnsignIn();
    await page.waitForTimeout(3000)
    await expect(page).toHaveTitle('S G Software Testing Institute')
    //Logout Action
    await homePage.clickOnLogoutLink()
    await expect(page).toHaveURL('https://sgtestinginstituteapp.onrender.com/login')
    await page.waitForTimeout(3000)
})

