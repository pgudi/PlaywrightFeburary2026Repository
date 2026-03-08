const {test, expect} = require('@playwright/test')

test.describe.skip("Santiy Tests", ()=>{
    test("First Santiy Testcase", async()=>{
        console.log("It is a First Santiy Testcase");
        
    })

    test("Second Santiy Testcase", async()=>{
        console.log("It is a Second Santiy Testcase");
        
    })
})

test.describe("Regression Tests", ()=>{
    test("First Regression Testcase", async()=>{
        console.log("It is a First Regression Testcase");
        
    })

    test("Second Regression Testcase", async()=>{
        console.log("It is a Second Regression Testcase");
        
    })
})

test.describe.skip("Unit Tests", ()=>{
    test("First Unit Testcase", async()=>{
        console.log("It is a First Unit Testcase");
        
    })

    test("Second Unit Testcase", async()=>{
        console.log("It is a Second Unit Testcase");
        
    })
})