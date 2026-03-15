
class HomePage{

    constructor(page){
        this.page=page
        this.logoutLnk = page.locator("//button[normalize-space()='Logout']")
    }

    async clickOnLogoutLink(){
        await this.logoutLnk.click()
    }
}

module.exports = {HomePage}