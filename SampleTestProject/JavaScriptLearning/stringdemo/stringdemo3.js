/*
    trimStart -> It removes blank space from Left hand side
    trimEnd -> It removes blank space  from Right hand side
    trim -> It removes blank space  from both side
    lpad -> It appends characters at left side based on length specified
    rpad -> It appends characters at right side based on length specified
*/
// ltrim -> It removes blank space or character from Left hand side
let str1="   Welcome   "
//before trimStart find number of characters
console.log("# of characters :"+str1.length);
// After trimstart find number of characters
let v1=str1.trimStart()
console.log("# of characters :"+v1.length);

// trimEnd -> It removes blank space or character from Right hand side
let str2="  Welcome    "
// before trimEnd , find number of characters
console.log("BEfore trimEnd, Number of Characters :"+str2.length);
// After trimEnd find number of characters
let v2=str2.trimEnd()
console.log("After trimEnd, Number of Characters :"+v2.length);

// trim -> It removes blank space or character from both side
let str3 ="  Morning    " 
// before Trim , find number characters
console.log("# of Characters bfore Trim :"+str3.length);
//After trim, find number of characters
let v3=str3.trim()
console.log("After trim, Number of charaxters :"+v3.length);

// special Case, Can we remove characters,
//\ No, we can't remove characters only spaces only remove
let str4="aaaaaWELCOMEbbbb"
console.log(str4.trimStart('a'))

// lpad -> It appends characters at left side based on length specified
let str5="WELCOME"
let v4=str5.padStart(10,'#')
console.log("Left Padding Result :"+v4);
// rpad -> It appends characters at right side based on length specified
let str6="WELCOME"
let v5=str6.padEnd(10,'#')
console.log("Right Padding Result :"+v5);
