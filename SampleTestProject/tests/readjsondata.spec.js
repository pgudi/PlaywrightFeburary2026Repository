const {test, expect} = require('@playwright/test')
const data1 = require('./../datafiles/data1.json')
const data2 = require('./../datafiles/data2.json')
const data3 = require('./../datafiles/nesteddata3.json')
test("Read Data from JSON Object", async({page})=>{

    console.log(data1.username);
    console.log(data1.coursename);
    console.log(data1.cityname);
})

test.only("Read Data from Nested JSON Object", async({page})=>{

    //Read First JSON Object
    console.log(data3.santu.username);
    console.log(data3.santu.coursename);
    console.log(data3.santu.cityname);
    //Read Second JSON Object
    console.log(data3.adi.username);
    console.log(data3.adi.coursename);
    console.log(data3.adi.cityname);
    //Read Third JSON Object
    console.log(data3.srinu.username);
    console.log(data3.srinu.coursename);
    console.log(data3.srinu.cityname);
    
})


test("Read Data from JSON Array Object", async({page})=>{

    for(let testdata of data2){
        console.log(testdata.username);
        console.log(testdata.coursename);
        console.log(testdata.cityname);
    }
})
