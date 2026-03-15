
function customer(){
    this.customerid=101
    this.customerName="Lenovo"
}

customer.prototype.emailid="services@lenovo.com"

let f1=new customer()
console.log(f1.customerid);
console.log(f1.customerName);
console.log(f1.emailid);

let f2=new customer()
console.log(f2.customerid);
console.log(f2.customerName);
console.log(f2.emailid);