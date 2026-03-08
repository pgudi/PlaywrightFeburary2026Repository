/*
  The number which is divisible by 1 and itself
    suppose if the input is 9
    2 3 4 5 6 7 8
*/

let flag=0
let num=91
for(let i=2;i<num;i++){
    if(num % i ==0){
        flag++
        break
    }
}

if(flag==0){
    console.log(num+" is a Prime Number")
}else{
    console.log(num+" is not a Prime Number")
}