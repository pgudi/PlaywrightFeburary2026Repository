class LoginPage{

    constructor(page){
        this.page=page
        this.userName = page.locator("input[name='username']")
        this.password = page.locator("input[name='password']")
        this.signIn = page.locator(':text("Sign In")')
    }

    async setUserName(userName){
       await this.userName.fill(userName)
    }

    async setPassword(password){
        await this.password.fill(password)
    } 

    async clickOnsignIn(){
        await this.signIn.click()
    }
}

module.exports = {LoginPage}