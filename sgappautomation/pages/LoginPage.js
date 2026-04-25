class LoginPage{
    constructor(page){
        this.page=page
        this.userNameTextField = page.locator('input[name="username"]')
        this.passwordTextField = page.locator('input[name="password"]')
        this.signInBtn = page.locator("//button[normalize-space()='Sign In']")
       
    }

    async setUserName(username){
        await this.userNameTextField.fill(username)
    }

    async setPassword(password){
        await this.passwordTextField.fill(password)
    }

    async clickOnSignIn(){
        await this.signInBtn.click()
    }
}
module.exports = {LoginPage}