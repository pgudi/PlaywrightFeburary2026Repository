class Department{
    constructor(deptno,dname){
        this.deptno=deptno
        this.dname=dname
    }
}
Department.prototype.loc="California"

Department.prototype.showCountry=function(){
                                    console.log("Country Name is United State of America")
                                }

let o=new Department(10, "Accounting")
console.log("Depat Number:"+o.deptno, "Department Name :"+o.dname, "Location :"+o.loc);
o.showCountry()

let o1=new Department(20, "Sales")
console.log("Depat Number:"+o1.deptno, "Department Name :"+o1.dname, "Location :"+o1.loc);
o.showCountry()