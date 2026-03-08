const {test, expect} = require('@playwright/test')

test.beforeEach(async()=>{
    console.log("Login into the Application !!!");
    
})

test.afterEach(async()=>{
    console.log("Logout from the Application!!!");
    
})

test("It is a First Testcase",async({page})=>{
    console.log("It is a First Playwright Testcase");
    
})

test("It is a Second Testcase",async({page})=>{
    console.log("It is a Second Playwright Testcase");
    
})


test("It is a Third Testcase",async({page})=>{
    console.log("It is a Third Playwright Testcase");
    
})

test("It is a Fourth Testcase",async({page})=>{
    console.log("It is a Fourth Playwright Testcase");
    
})