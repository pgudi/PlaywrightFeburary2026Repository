const { log } = require("console");

function isPrime(num){
    let flag=0
    for(let i=2;i<num;i++){
        if(num % i ==0){
            flag++;
            break
        }
    }
    if(flag==0){
        return true
    }else{
        return false
    }
}
console.log("-----------------------------");

//First EXecution
let v1=isPrime(24)
console.log(v1);
console.log("-----------------------------");
//Second Execution
//Print print numbers in between 1 to 50
for(let i=1;i<=50;i++){
    if(isPrime(i)==true){
        console.log(i);
        
    }
}

console.log("-----------------------------");
//Third Execution
//Find sum of Prime number in between 1 to 100
let sum=0
for(let i=1;i<=100;i++){
    if(isPrime(i)==true){
        sum=sum+i
    }
}
console.log("Sum of Prime Numbers in between 1 to 100 :"+sum);
console.log("-----------------------------");
//Fourth Execution
//Find count of Prime number in between 1 to 100
let count=0
for(let i=1;i<=100;i++){
    if(isPrime(i)==true){
        count=count+1
    }    
}
console.log("Count of Prime Numbers in between 1 to 100 :"+count);