const {test, expect} = require('@playwright/test')

test.skip("Verify Integer value", async ({page})=>{
    await expect(10).toBe(10)
})

test.skip('verify decimal values', async ({page})=>{
    await expect(14.75).toBe(14.75)
})

test("Veify Less than condition", async({page})=>{
    await expect(250).toBeLessThan(300)
})

test('Verify Greater than eqaul to Condition', async({page})=>{
    let actual=900
    let expected=600
    await expect(actual).toBeGreaterThanOrEqual(expected)

})

test("Verify boolean value", async ({page})=>{
    await expect(125<=400).toBeTruthy()
})

test("Verify inverse approach", async({page})=>{
    await expect(120>=400).toBeFalsy()
})

test("Verify Logical Approach", async({page})=>{
    let x=100
    let y=200
    await expect((x<=y) && (y>=x)).toBeTruthy()
})

test("Validate String Content", async({page})=>{
    await expect("S G Software Testing Institute").toContain("Software")
})

test("Validate String Content partially", async({page})=>{
    await expect("S G Software Testing Institute".includes("Testing123")).toBeTruthy()
})