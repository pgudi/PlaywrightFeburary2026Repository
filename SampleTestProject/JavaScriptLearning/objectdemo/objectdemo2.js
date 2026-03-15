/*
  define Object and access the properties of the object
  update values
  delete value
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

// update Existing object
person.course ="Research"
console.log(person);
person.country="India"
console.log(person);

//Delete values based on key
delete person.country
console.log(person);