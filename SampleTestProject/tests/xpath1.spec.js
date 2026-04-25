const {test, expect} = require('@playwright/test')

test("Identify Elements based on Attribute Name and Value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=html/body/div/form/input").first().fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//input").first().fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath tagName with index", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//input[2]").first().fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath tagName with attribute name and value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//input[@name='pass1word1']").fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath attribute name and value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//*[@name='pass1word1']").fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath attribute value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//*[@*='pass1word1']").fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath Multiple attribute name and value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//input[@type='text'][@name='pass1word1']").fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath Multiple attribute name and value using and operator", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//input[@type='text' and @name='pass1word1']").fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath Multiple attribute name and value using or operator", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//input[@class='pass1word1' or @name='pass1word1']").fill("DemoUser1")
    await page.waitForTimeout(3000)
})

test("Identify Elements based on relative XPath Partial MAtching of Attribute Value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//input[contains(@id,'k1w')]").click()
    await page.waitForTimeout(3000)
})

test("Identify Multiple Elements based on relative XPath Attribute Name", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    const links=await page.$$("xpath=//a[@href]")
    //display Number of Links in the Application
    console.log("# of Links :"+links.length);
    
    await page.waitForTimeout(3000)
    //Display Link Names
    for(let i=0;i<links.length;i++){
        let linkContent=await links[i].textContent()
        console.log("Link Name :"+linkContent);
        
    }
})

test("Identify Elements based on relative XPath text content", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//a[text()='S G Software Testing']").click()
    await page.waitForTimeout(3000)
})

test.only("Identify Elements based on relative XPath Partial text content", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(2000)
    await page.locator("xpath=//a[contains(text(),'Software')]").click()
    await page.waitForTimeout(3000)
})