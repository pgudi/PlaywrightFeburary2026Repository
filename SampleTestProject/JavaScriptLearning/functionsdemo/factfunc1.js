/*
  Example 2: find factorial of a number 
*/
//Named function
function findFactorial1(num){
    let fact=1
    for(let i=num;i>=1;i--){
        fact=fact * i
    }
    console.log("Factorial of "+num+" is "+fact);
    
}
findFactorial1(5)

// Ananymous Function
let findFactorial2=function (num){
    let fact=1
    for(let i=num;i>=1;i--){
        fact=fact * i
    }
    console.log("Factorial of "+num+" is "+fact);
    
}
findFactorial2(6)

// Arrow Function
// Ananymous Function
let findFactorial3= (num)=>{
    let fact=1
    for(let i=num;i>=1;i--){
        fact=fact * i
    }
    console.log("Factorial of "+num+" is "+fact);
    
}
findFactorial3(7)