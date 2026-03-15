class Student{

    static showRollNo(rollNo){
        console.log("roll Number of Student :"+rollNo);
        
    }

    static showStudentName(name){
        console.log("Student Name :"+name);
        
    }

    showCourseName(coursename){
        console.log("Course Name :"+coursename);
        
    }
}

Student.showRollNo(1001)
Student.showStudentName("Srinivasa")

let o=new Student()
o.showCourseName("Maths and Science")