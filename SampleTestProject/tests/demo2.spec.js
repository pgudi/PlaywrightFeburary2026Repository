const {test, expect} = require('@playwright/test')

test("First PLaywright Testcase", async function display(){
   await console.log("Welcome to First Playwright Test case");
    
})

test("Second PLaywright Testcase", async function (){
   await console.log("Welcome to Second Playwright Test case");
    
})

test("Third PLaywright Testcase", async ()=>{
    await console.log("Welcome to Third Playwright Test case");
    
})