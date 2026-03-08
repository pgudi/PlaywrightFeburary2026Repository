
function getFactorial(num){
    let fact=1
    for(let i=num;i>=1;i--){
        fact=fact * i
    }
    return fact;
}
let v1=getFactorial(5)
console.log(v1);
console.log("--------------------------");
function showFactorial(num){
    let fact=1
    for(let i=num;i>=1;i--){
        fact=fact * i
    }
    console.log("Factorial of "+num+" is "+fact);
    
}
showFactorial(5)