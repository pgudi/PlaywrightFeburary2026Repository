const {Given, When, Then, setDefaultTimeout} = require('@cucumber/cucumber')
const {expect, chromium} = require('@playwright/test')
let browser,context, page
const { CustomerPage } = require('../../pages/CustomerPage')
const { LoginPage } = require('../../pages/LoginPage')
const { HomePage } = require('../../pages/HomePage')

When("I navigate Application url", async function(){
    await this.page.goto("https://sgtestinginstituteapp.onrender.com/")
})

Then("I find the login page", async function(){
    await expect(this.page).toHaveTitle("S G Software Testing Institute")
})

When("I enter {string} in username text field", async function(username){
    await this.loginPage.setUserName(username)
})

When("I enter {string} in password text field", async function(password){
    await this.loginPage.setPassword(password)
})

Then("I close application", async function(){
    await this.page.close()
    await context.close()
})

When("I click on SignIn button", async function(){
    await this.loginPage.clickOnSignIn()
})

Then("I find the Home page", async function(){
    await expect(this.page).toHaveURL("https://sgtestinginstituteapp.onrender.com/home")
})

When("I click on Logout option", async function(){
    this.homePage.clickOnLogoutLink()
})

When("I click on Customer Menu", async function(){
    await this.customerPage.clickOnCustomerMenu()
})

When("I click on Add Customer button", async function(){
    await this.customerPage.clickOnAddCustomer()
})

When("I enter {string} in customer Name text field", async function(customername){
    await this.customerPage.setCustomerName(customername)
})

When("I enter {string} in emailID text field", async function(emailid){
    await this.customerPage.setCustomerEmailId(emailid)
})

When("I enter {string} in location text field", async function(location){
    await this.customerPage.setCustomerLocation(location)
})
When("I enter {string} in description text field", async function(description){
    await this.customerPage.setCustomerDescription(description)
})

When("I click on save button", async function(){
    await this.customerPage.saveCustomerRecord()
})

Then("I find newly created or modified {string} in List Customer Page", async function(customername){
    // const webElement = await this.customerPage.customerNameCell(customername)
    // const customerName=await webElement.textContent()
    // console.log("Customer Name :"+ customerName)
    // expect(customerName).toContain(customername)
    // Wait for the table to load after save
    await this.page.waitForLoadState("networkidle");

    // Locator for the dynamic customer name
    const cell = this.page.locator(`//td[normalize-space()='${customername}']`);

    // Wait explicitly for the element to appear
    await cell.waitFor({ timeout: 30000 });

    const text = await cell.textContent();
    console.log("Customer Found:", text);

    expect(text).toContain(customername);
})

When("I delete the newly created or modified {string} from List Customer Page", async function(customername){
        this.page.on("dialog", async(dialog)=>{
        const message=await dialog.message()
        console.log("Message :"+message);
        await dialog.accept()
        
    })
    // await this.customerPage.deleteButton(customername).click()
    await this.page.locator(`//td[text()='${customername}']/following-sibling::td/following-sibling::td/following-sibling::td/following-sibling::td/button[2]`).click()
    
})

When('I click on Edit option for newly created {string} in List Customer Page', async function(customername) {
    await this.customerPage.editButton(customername).click()
});