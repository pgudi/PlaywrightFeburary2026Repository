/*
   concat -> it concates and provides teh result
   endsWith -> It verifies the given string is availalbe at end of teh string
   repeat -> It provides repeation of characters or string
   substr -> It provides substr
   startsWith -> It verifies the given string string is availalbe at start of String
   slice -> It provides slice of a given string
   split -> It splits String by default on space o delimeter
*/
//concat -> it concates and provides the  result
let str1="Good Morning"
let v1=str1.concat(" To Everyone")
console.log("Concat Result :"+v1);

// endsWith -> It verifies the given string is availalbe at end of teh string
let str2="Bangalore is garden city of Karnataka"
let v2=str2.endsWith("Karnataka")
console.log("Partial MAtching of String :"+v2);
console.log("---------------------");

// repeat -> It provides repeation of characters or string
let str3="Swimming"
let v3=str3.repeat(10)
console.log(v3);
console.log("---------------------");

//substr -> It provides substr
let str4="Programming";
let v4=str4.substring(3)
console.log("Extract from Start :"+v4);
let v5=str4.substring(3,7)
console.log("Extract from Start to End :"+v5);

// startsWith -> It verifies the given string string is availalbe at start of String
let str5="Bangalore is garden city of Karnataka"
let v6=str5.startsWith("Bangalore")
console.log("Partial MAtching of String :"+v6);
console.log("---------------------");

// slice -> It provides slice of a given string
let str6="Programming"
let v7=str6.slice(3,7)
console.log("slicing Result :"+v7);
console.log("---------------------");

// split -> It splits String by default on space o delimeter
let str="Mango, Banana, Orange, Grapes, Apple"
let arr = str.split(",")
console.log(arr);
