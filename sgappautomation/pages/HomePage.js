class HomePage{
    constructor(page){
        this.page=page
        this.logoutLink = page.locator("//button[normalize-space()='Logout']")
    }

    async clickOnLogoutLink(){
        await this.logoutLink.click()
    }
}
module.exports = {HomePage}