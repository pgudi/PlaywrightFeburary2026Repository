/*
    chatAt -> It extract a single char at a time
    replace -> It replace given String
    includes -> It verifies whether Partial matching of String
    indexOf -> It provides position of character or string (left to Right)
    lastIndexOf --> It provides position of character or string (right to Left)
*/
// chatAt -> It extract a single char at a time
let s1="WELCOME"
let ch1=s1.charAt(0)
console.log("Extract Character :"+ch1);
console.log("---------------------");
//replace -> It replace given String
let s2="It is a new palace"
let s3=s2.replace("is","was")
console.log("Replaced Result :"+s3);
console.log("---------------------");
// includes -> It verifies whether Partial matching of String
let s4="Bangalore is garden city of Karnataka"
let s5=s4.includes("garden")
console.log("Partial MAtching of String :"+s5);
console.log("---------------------");
// indexOf -> It provides position of character or string (left to Right)
let str1="xxaxxaxxaXXAXXA";
let v2=str1.indexOf('A')
console.log("Position of A :"+v2);
console.log("---------------------");
let str="xxaxxaxxaXXAXXA";
let v1=str.indexOf('A',12)
console.log("Position of A :"+v1);
console.log("---------------------");
// lastIndexOf --> It provides position of character or string (right to Left)
let str2="xxaxxaxxaXXAXXA";
let v3=str2.lastIndexOf('A')
console.log("Position from Right to Left :"+v3);
