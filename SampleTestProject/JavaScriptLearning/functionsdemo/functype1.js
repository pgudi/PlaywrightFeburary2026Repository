/*
  Example: Write a function to find area of Circle for given radius array
*/
//Named Function
let radius =[2,4,6,3,7,5]

function findArea(radius){
    let result=[]
    for(let i=0;i<radius.length;i++){
        result.push(Math.PI * radius[i] * radius[i])
    }
    return result
}

console.log(findArea(radius));
console.log("---------------------------");

// Ananymous function
let showArea= function (radius){
    let result=[]
    for(let i=0;i<radius.length;i++){
        result.push(Math.PI * radius[i] * radius[i])
    }
    return result
}

console.log(showArea(radius));
console.log("---------------------------");

// Arrow function
let displayArea=  (radius)=>{
    let result=[]
    for(let i=0;i<radius.length;i++){
        result.push(Math.PI * radius[i] * radius[i])
    }
    return result
}

console.log(displayArea(radius));