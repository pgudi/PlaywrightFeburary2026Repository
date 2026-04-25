const { test, expect } = require('@playwright/test')
const { request } = require('node:http')
let tokenData=""
let custId=0
test("Authneticate User", async ({ request }) => {
    const response = await request.post("https://sgtestinginstitute.onrender.com/api/v1/authenticate", {
        data: {
            "username": "pgudi",
            "password": "pgudi"
        },
        headers: {
            "Content-Type": "application/json"
        }
    })

    tokenData = await response.text()
    console.log("Token Data :" + tokenData);
})

test("Create Customer Request", async({request})=>{
    console.log("This Testcase create Customer using POST HTTP Method");
    
    const response=await request.post("https://sgtestinginstitute.onrender.com/api/v1/customers",{
        data: {
            "customerName": "Titan",
            "emailId": "demoservices@titan.com",
            "location": "Marathhalli",
            "customerDescription": "Testing Purpose"
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization":"Bearer "+tokenData

        }
    })
    const jsondata = await response.json()
    custId=jsondata.customerId
    console.log("Customer Id :"+custId);
    
    //Print Customer Resposne
    const customerContent=(await response.text()).toString()
    console.log("Customer Content :"+customerContent);
    //Validation
    await expect(response.status()).toBe(201)
    
})

test("Display Newly Created Customer", async({request})=>{
    console.log("This Testcase display existing Customer using GET HTTP Method");
    const response=await request.get("https://sgtestinginstitute.onrender.com/api/v1/customers/"+custId, {
        headers: {
            "Content-Type": "application/json",
            "Authorization":"Bearer "+tokenData

        }
    })
    //Print Customer Resposne from GET Method
    const customerContent=(await response.text()).toString()
    console.log("Customer Content :"+customerContent);
    //Validation
    await expect(response.status()).toBe(200)
})

test("Delete Newly Created Customer", async({request})=>{
    console.log("This Testcase Deletes existing Customer using DELETE HTTP Method");
    const response=await request.delete("https://sgtestinginstitute.onrender.com/api/v1/customers/"+custId, {
        headers: {
            "Content-Type": "application/json",
            "Authorization":"Bearer "+tokenData

        }
    })
    //Print Delete Customer Resposne from DELETE Method
    const customerContent=(await response.text()).toString()
    console.log("Customer Content :"+customerContent);
    //Validation
    await expect(response.status()).toBe(200)
})