class Employee{
    constructor(eid,ename,job,sal){
        this.eid=eid
        this.ename=ename
        this.job=job
        this.sal=sal
    }

    displayEmployeeId(){
        console.log("Employee Id :"+this.eid);
        
    }

    displayEmployeeName(){
        console.log("Employee Name :"+this.ename);
        
    }

    displayEmployeeJob(){
        console.log("Employee Job :"+this.job);
        
    }

    displayemployeeSal(){
        console.log("employee Sal :"+this.sal);
        
    }
}

module.exports = {Employee}