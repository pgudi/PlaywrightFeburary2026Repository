const { Before, After, AfterStep, Status, setDefaultTimeout } = require('@cucumber/cucumber')
const { chromium } = require('playwright');
const { CustomerPage } = require('../../pages/CustomerPage')
const { LoginPage } = require('../../pages/LoginPage')
const { HomePage } = require('../../pages/HomePage')
setDefaultTimeout(60000)

let browser, context, page
Before(async function () {
    browser = await chromium.launch({
        headless: false
    })
    context = await browser.newContext()
    this.page = await context.newPage()
    this.customerPage = new CustomerPage(this.page)
    this.loginPage = new LoginPage(this.page)
    this.homePage = new HomePage(this.page)
})

After(async function () {
    await this.page.close()
})

AfterStep(async function ({ result }) {
    if (result.status === Status.PASSED) {
        const screenshot = await this.page.screenshot({ fullPage: true })
        this.attach(screenshot, 'image/png')
    }
})