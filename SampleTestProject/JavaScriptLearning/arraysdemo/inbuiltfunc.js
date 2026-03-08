/*
    in-bult functions in Array
    Part -1
*/
// concat function, it combines elements of two arrays
let arr=[10,20,30,70,60,50,40,30]
let a=[5,15,25,35]
let result=arr.concat(a)
console.log(result);
console.log("-------------------------------");

//includes function provides true or false based on Elements is available
let v1=arr.includes(50)
console.log("Elements Exists :"+v1);
console.log("-------------------------------");
//indexOf function provides index based on teh Element [from Left to Right]
let v2=arr.indexOf(30)
console.log("Position of Element :"+v2);
console.log("-------------------------------");
//lastIndexOf function provides index based on teh Element [from Right to Left]
let v3=arr.lastIndexOf(30)
console.log("Position of Element :"+v3);
console.log("-------------------------------");
// join function combines Elements from array based on delimeter
let arr1=[30,10,90,40,50,20]
let result1=arr.join("#")
console.log("Join Result :"+result1);
