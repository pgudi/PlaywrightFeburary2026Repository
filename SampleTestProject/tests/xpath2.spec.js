const {test, expect} = require('@playwright/test')

test("For Person Name Sachin Tendulkar enter the salary 25000", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/WebTableHTML.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//td[text()='Sachin Tendulkar']/following-sibling::td/following-sibling::td/following-sibling::td/following-sibling::td/input").fill("25000")
    await page.waitForTimeout(3000)
})

test("Enter the salary 18000 for the person who is next to Sachin Tendulkar", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/WebTableHTML.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//td[text()='Sachin Tendulkar']/following::tr[1]/td[6]/input").fill("18000")
    await page.waitForTimeout(3000)
})

test("Make status as Active for Designation Indian Freedom Fighter", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/WebTableHTML.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//td[text()='Indian Freedom Fighter']/preceding-sibling::td[1]/preceding-sibling::td[1]/input").click()
    await page.waitForTimeout(3000)
})

test("Make the status as Active for Person who is previous to Rahul Dravid", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/WebTableHTML.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//td[text()='Rahul Dravid']/preceding::tr[1]/td[1]/input").click()
    await page.waitForTimeout(3000)
})

test("based on table reference enter the salary for 5th Record", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/WebTableHTML.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//table[@id='tbl1']/descendant::tr[5]/td[6]/input").fill("21000")
    await page.waitForTimeout(3000)
})

test.only("Based on 4th Salary field fetch table id attribute.", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/WebTableHTML.html")
    await page.waitForTimeout(2000)
    const val=await page.locator("xpath=//input[@id='edit4']/ancestor::td/ancestor::tr/ancestor::table").getAttribute("id")
    console.log("ID Attribute Value :"+val);
    
    await page.waitForTimeout(3000)
})