const {test, expect} = require('@playwright/test')

test("It is a First santiy testcase @sanity", async()=>{
    console.log("It is a First Santiy Testcase");
    
})

test("It is a Second santiy testcase @sanity", async()=>{
    console.log("It is a Second Santiy Testcase");
    
})

test("It is a First regression testcase @regression", async()=>{
    console.log("It is a First regression Testcase");
    
})

test("It is a Second regression testcase @regression", async()=>{
    console.log("It is a Second regression Testcase");
    
})

test("It is a First Santiy & Regression testcase @sanity@regression", async()=>{
    console.log("It is a First Santiy & Regression Testcase");
    
})

test("It is a Second Santiy & Regression testcase @sanity@regression", async()=>{
    console.log("It is a Second Santiy & Regression Testcase");
    
})