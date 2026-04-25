const {test, expect} = require('@playwright/test')

test("Absolute CSS to Identify the Element", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=html body div form input").first().fill("DemoUser1")
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based on tagName", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=input").first().fill("DemoUser1")
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based on tagName with id attribute value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=input#pwd1pass1word1").fill("demopassword123")
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based on id attribute value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=#pwd1pass1word1").fill("demopassword123")
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based on tagName with class attribute value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=input.pass1word1").fill("demopassword123")
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based class attribute value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=.pass1word1").fill("demopassword123")
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based tagName with attribute Name and value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=input[name='windows']").click()
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based tagName with multiple attribute Name and value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=input[type='checkbox'][name='linus']").click()
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based tagName with partial matching of attribute value", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
  //  await page.locator("css=input[id*='k1w']").click()
    await page.locator("css=input[id^='chk1']").click()
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based tagName with attribute Name 01", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    const links=await page.$$("css=a[href]")
    //Number of Links in the Application
    console.log("Number of Links available :"+links.length);
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based tagName with attribute Name 02", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    const links=await page.$$("css=a[href]")
    //display All Link Names
    for(let i=0;i<links.length;i++){
        const linkName=await links[i].textContent()
        console.log("Link Name :"+linkName);
    }
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the Element based tagName with attribute Name 03", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    const links=await page.$$("css=a[href]")
    //display All Link Names
    for(let i=0;i<links.length;i++){
        const linkName=await links[i].textContent()
        if(linkName.endsWith("Testing")){
            await links[i].click()
            break
        }
    }
    await page.waitForTimeout(2000)
})

test("Relative CSS to Identify the nth Child Element", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=form#frm3 > :nth-child(4)").fill("DemoUser4")
    await page.waitForTimeout(2000)
})

test.only("Relative CSS to Identify the sibling Element", async({page})=>{
    await page.goto("file:///C:/AutomationBackupFolders/Demo/Sample.html")
    await page.waitForTimeout(3000)
    await page.locator("css=form#frm3 > input + input + input").fill("DemoUser3")
    await page.waitForTimeout(2000)
})