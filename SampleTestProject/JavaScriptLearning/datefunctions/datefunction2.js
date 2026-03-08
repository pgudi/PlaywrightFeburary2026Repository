/*
    Write a program to display date in below format
    07-03-2026 [Current Date]
*/
let date=new Date()
let v1=date.getDate()
let v2=date.getMonth()+1
let v3=date.getFullYear()

console.log(v1+"-"+v2+"-"+v3);

if(v1<10){
    v1="0"+v1
}
console.log(v1)
if(v2<10){
    v2="0"+v2
}
console.log(v2)
console.log(v1+"-"+v2+"-"+v3);