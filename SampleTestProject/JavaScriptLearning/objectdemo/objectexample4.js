/*
  object example
*/

let employee={
    eid:101,
    ename:"Santosh",
    "job":"Manager",
     sal:17000
}


for(let x in employee){
    console.log(employee[x]);
    
}
console.log("-----------------------");
// Read key and value pair

for(let i in employee){
    console.log(i + " ---> "+employee[i]);
    
}