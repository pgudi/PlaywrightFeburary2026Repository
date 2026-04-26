const { Given, When, Then } = require('@cucumber/cucumber')
const { request, expect } = require('@playwright/test')

Given("I execute authenticate Post Http Method", async ()=>{
    this.apiRequest = await request.newContext()
    this.response = await this.apiRequest.post("https://sgtestinginstitute.onrender.com/api/v1/authenticate", {
        data: {
            "username": "pgudi",
            "password": "pgudi"
        },
        headers: {
            "Content-Type": "application/json"
        }
    })    
})

Given("I capture the authenticate response", async ()=>{
    const responseData = await (await this.response.text()).toString()
    console.log("Response Data :"+responseData);
    
})  

When("I store the token in a variable" , async ()=>{
    this.apiToken = await (await this.response.text()).toString()
    console.log("Api token :"+this.apiToken);
    
})


Then("I find the 200 status code", async ()=>{
    await expect(this.response.status()).toBe(200)
})

Given("I execute display all customers Get Http Method", async ()=>{
    this.responseCustomer=await this.apiRequest.get("https://sgtestinginstitute.onrender.com/api/v1/customers",{
        headers: {
            "Content-Type": "application/json",
            "authorization" :"Bearer "+this.apiToken
        }
    })
})

When("I store the all customer response in a variable", async()=>{
    const responseData = await (await this.responseCustomer.text()).toString()
    console.log("Response Data :"+responseData);
})

Given("I execute Create Customer Post Http Method", async ()=>{
    this.responseCreateCustomer=await this.apiRequest.post("https://sgtestinginstitute.onrender.com/api/v1/customers", {
    data: {
            "customerName": "auto_customer01",
            "emailId": "auto_customer01@gmail.com",
            "location": "Dallas",
            "customerDescription": "Testing Purpose",
        },
        headers: {
            "Content-Type": "application/json",
            "authorization" :"Bearer "+this.apiToken
        }
    })
})

When("I store the create customer response in a variable", async ()=>{
    const responseCreateData = (await this.responseCreateCustomer.text()).toString()
    console.log("Create Customer Response :"+responseCreateData);
    
})

When("I store customer id in a variable", async()=>{
    const responseCustomer = await this.responseCreateCustomer.json()
    this.custId = await responseCustomer.customerId;
    console.log("Customer Id :"+this.custId);
    
})

Then("I find the 201 status code", async ()=>{
    await expect(this.responseCreateCustomer.status()).toBe(201)
})

Given("I execute Display Customer Get Http Method", async ()=>{
    this.responseGetCustomer=await this.apiRequest.get("https://sgtestinginstitute.onrender.com/api/v1/customers/"+this.custId, {
    headers: {
            "Content-Type": "application/json",
            "authorization" :"Bearer "+this.apiToken
        }
    })
})

When("I store the display customer response in a variable", async()=>{
    const responseGetData = (await this.responseGetCustomer.text()).toString()
    console.log("Display Customer Response :"+responseGetData);
})

Given("I execute Delete Customer Delete Http Method",async () =>{
    this.responseDeleteCustomer=await this.apiRequest.delete("https://sgtestinginstitute.onrender.com/api/v1/customers/"+this.custId, {
    headers: {
            "Content-Type": "application/json",
            "authorization" :"Bearer "+this.apiToken
        }
    })
})

When("I store the delete customer response in a variable", async()=>{
    const responseDeleteData = (await this.responseDeleteCustomer.text()).toString()
    console.log("Delete Customer Response :"+responseDeleteData);
})
