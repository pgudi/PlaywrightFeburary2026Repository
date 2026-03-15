/*
  define Object and access the properties of the object
*/

var person={
    name:"Santosh",
    age:22,
    city:"New York"
}

// first Approach 
console.log(person.name);
console.log(person.age);
console.log(person.city);
console.log("----------------------------");
//Second Approach
console.log(person["name"]);
console.log(person["age"]);
console.log(person["city"]);

