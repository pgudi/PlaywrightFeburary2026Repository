import {test, expect} from '@playwright/test'

test("First Playwright Testcase", function show(){
    console.log("Welcome to First Playwright Testcase");
    
})

test("Second Playwright Testcase", function(){
    console.log("Welcome to Second Playwright Testcase")
})

test("Third Playwright Testcase", () =>{
    console.log("Welcome to Third PLaywright Testcase")
})
