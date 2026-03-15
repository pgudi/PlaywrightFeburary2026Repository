/*
    Initializtion of variable is the process of assigning a value to a variable at the time of declaration. In JavaScript, you can initialize variables using the var, let, or const keywords. The choice of keyword affects the scope and mutability of the variable.

    1. var: Variables declared with var are function-scoped and can be re-assigned and re-declared within the same scope. They are hoisted to the top of their scope, meaning they can be accessed before their declaration (though they will be undefined until the declaration is reached).

    2. let: Variables declared with let are block-scoped and can be re-assigned but cannot be re-declared within the same scope. They are also hoisted, but they are not initialized until their declaration is evaluated, which means accessing them before declaration will result in a ReferenceError.       

    3. const: Variables declared with const are block-scoped and cannot be re-assigned or re-declared within the same scope. They must be initialized at the time of declaration, and their value cannot be changed afterward. Like let, const variables are hoisted but not initialized until their declaration is evaluated.
*/
// initialize var keyword
var x;
console.log(x);
x="Welcome"
console.log(x);
console.log("----------------------------------");  
// intialize let keyword
let y;
console.log(y);
y="Hello"
console.log(y); 
console.log("----------------------------------");
// intialize const keyword
const z;
console.log(z);
// z="Programming"; // TypeError: Assignment to constant variable.  