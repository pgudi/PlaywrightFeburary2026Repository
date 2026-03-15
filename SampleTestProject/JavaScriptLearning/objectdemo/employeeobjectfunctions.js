/*
  whether functions can be used in JavaScript objects
*/

let employee={
    eid: 101,
    ename:"Santosh",
    job:"Senoir Analyst",
    sal: 40000,
    bonus : function(){
                let result= (this.sal * 30)/100
                console.log("bonus :"+result);
                return result;
                
            },
    commission: function(){
                    let result1=(this.sal + this.bonus())/100
                    console.log("Commission :"+result1);
                    return result1
                },
    incentives: function(){
                     let result2=(this.sal + this.bonus()+ this.commission())
                    console.log("Incentives :"+result2);
                    return result2
                }
}

console.log(employee.eid);
console.log(employee.ename);
console.log(employee.job);
console.log(employee.sal);
console.log(employee.bonus());
console.log(employee.commission());
console.log(employee.incentives());
