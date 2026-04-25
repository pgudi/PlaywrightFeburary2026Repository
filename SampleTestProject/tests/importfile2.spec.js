const {test, expect} = require("@playwright/test")

test("Import Multiple Files Testcase", async({page})=>{
    await page.goto("https://html-file-upload.netlify.app/")
    await page.waitForTimeout(3000)
    await page.locator("//a[text()='Multiple File uploads']").click()
    await page.waitForTimeout(2000)
    await page.locator("#file-uploader").setInputFiles(["./uploads/AdminDashboard.js","./uploads/EmployeeDashboard.js"])
    await page.waitForTimeout(2000)
    await expect(await page.locator("//p[2]").textContent()).toContain("2 file(s) uploaded successfully!")
    await page.waitForTimeout(2000)
})