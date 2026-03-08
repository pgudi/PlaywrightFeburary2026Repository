/*
    in-bult functions in Array
    Part -2
*/
// push function, it inserts elements into an array at end of the array
let arr=[10,20,30,70,60,50,40,30]
arr.push("Mango")
console.log(arr);
console.log("-------------------");

//pop function, This function removes element from end 
let arr1=[10,20,30,70,60,50,40,30]
arr1.pop()
console.log(arr1);
console.log("-------------------");

// unshift function -> inserts elements at first position
let arr3=[10,20,30,70,60,50,40,30]
arr3.unshift(250)
console.log(arr3);
console.log("-------------------");

//shift function -> remove elements at first position
let arr4=[10,20,30,70,60,50,40,30]
arr4.shift()
console.log(arr4);
console.log("-------------------");

//slice it provides portion of teh array
let arr5=[10,20,30,70,60,50,40,30]
let result1=arr5.slice(2,5)
console.log(result1);
console.log("-------------------");
//splice , It removes number of elements from an array based on start position
let arr6=[10,20,30,70,60,50,40,30]
let result2=arr6.splice(2,5)
console.log(result2);
console.log(arr6);

console.log("-------------------");
// sort function , it used to sort the Eleemnts
let arr7=[10,20,30,70,60,50,40,30]
arr7.sort()
console.log(arr7);
