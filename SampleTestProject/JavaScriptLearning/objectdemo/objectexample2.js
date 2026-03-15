/*
  object example
*/

let employee={
    eid:101,
    ename:"Santosh",
    "job":"Manager",
     sal:17000
}

console.log(employee.eid);
console.log(employee.ename);
console.log(employee.job);
console.log(employee.sal);
console.log("-----------------------------------------------");

/*
  object array example
*/
let employee1=[
    {
        eid:101,
        ename:"Adams"
    },
     {
        eid:102,
        ename:"Ford"
    },
     {
        eid:103,
        ename:"King"
    }
]

console.log(employee1[0].eid);
console.log(employee1[0].ename);
console.log(employee1[1].eid);
console.log(employee1[1].ename);
console.log(employee1[2].eid);
console.log(employee1[2].ename);
console.log("-----------------------------------------------");

/*
  Nested json object example
*/
let employees ={
    "santu":{
        eid:101,
        ename:"Santosh"
    },
    "vinu":{
        eid:102,
        ename:"Vinith"
    },
    "adi":{
        eid:103,
        ename:"Adi Narayana"
    }
}
console.log(employees.santu.eid);
console.log(employees.santu.ename);
console.log(employees.vinu.eid);
console.log(employees.vinu.ename);
console.log(employees.adi.eid);
console.log(employees.adi.ename);

