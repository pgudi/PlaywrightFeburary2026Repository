class CustomerPage{
    constructor(page){
        this.page=page
        this.custoemrMenu = page.locator("//a[normalize-space()='Customers']")
        this.AddCustomerBtn = page.locator("//a[normalize-space()='Add Customer']")
        this.customerNameTextField = page.locator("//input[@placeholder='Enter Customer Name']")
        this.customerEmailId = page.getByPlaceholder('Enter EmailId', { exact: true })
        this.custoemrLocation = page.locator("//input[@placeholder='Enter Location']")
        this.customerDescription = page.locator("input[placeholder='Enter Description']")
        this.custoemrSaveBtn = page.locator("//button[normalize-space()='Save']")
    }

    // Dynamic locator instead of hard-coded Samsung1
    customerNameCell(customername) {
        return this.page.locator(`//td[normalize-space()='${customername}']`);
    }

    // Dynamic delete button next to that customer
    deleteButton(customername) {
        return this.page.locator(`//td[normalize-space()='${customername}']/following-sibling::td[last()]/button[2]`);
    }

    // Dynamic edit button next to that customer
    editButton(customername) {
        return this.page.locator(`//td[normalize-space()='${customername}']/following-sibling::td[last()]/button[1]`);
    }

    async clickOnCustomerMenu(){
        await this.custoemrMenu.click()
    }

    async clickOnAddCustomer(){
        await this.AddCustomerBtn.click()
    }

    async setCustomerName(customerName){
        await this.customerNameTextField.fill(customerName)
    }

    async setCustomerEmailId(emailId){
        await this.customerEmailId.fill(emailId)
    }

    async setCustomerLocation(location){
        await this.custoemrLocation.fill(location)
    }

    async setCustomerDescription(description){
        await this.customerDescription.fill(description)
    }

    async saveCustomerRecord(){
        await this.custoemrSaveBtn.click()
    }

}
module.exports = {CustomerPage}