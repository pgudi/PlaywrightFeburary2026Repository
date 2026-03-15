class Student{

    firstName;
    age;
    courseName;
    setFirstName(firstname){
        this.firstName=firstname
    }
    setAge(age){
        this.age=age
    }
    setCourseName(courseName){
        this.courseName=courseName
    }

    getFirstName(){
        return this.firstName
    }

    getAge(){
        return this.age
    }

    getCourseName(){
        return this.courseName
    }
}

let o= new Student()
o.setFirstName("Srinivasa")
o.setAge(25)
o.setCourseName("Arts")
console.log(o.getFirstName());
console.log(o.getAge());
console.log(o.getCourseName());