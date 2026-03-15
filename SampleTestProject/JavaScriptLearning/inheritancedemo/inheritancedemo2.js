class Employee{
    constructor(eid,ename,job){
        this.eid=eid
        this.ename=ename
        this.job=job
    }
    showEmployeeDetails(){
        console.log(this.eid, this.ename, this.job);
        
    }
}
class Department extends Employee{
    constructor(deptno,dname, eid,ename,jobname){
        super(eid, ename, jobname)
        this.deptno=deptno
        this.dname=dname
    }

    showDepartmentDetails(){
        console.log(this.deptno, this.dname);
        
    }
}

let o=new Department(10, "Accounting",7211,"Santosh","Sales Executive")
o.showDepartmentDetails()
o.showEmployeeDetails()