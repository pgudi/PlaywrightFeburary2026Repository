
class Customer{
    constructor(custId, custName, email){
        this.custId=custId
        this.custName=custName
        this.email=email
    }

    showCustomerId(){
        console.log("Customer ID :"+this.custId);
    }

    showCustomerName(){
        console.log("Customer Name :"+this.custName);
    }

    showCustomerEmail(){
        console.log("Customer Email :"+this.email)
    }
}
let c1=new Customer(101,"Lenovo Laptops","services@lenovo.com")
c1.showCustomerEmail()
c1.showCustomerId()
c1.showCustomerName()

let c2=new Customer(102,"Dell Laptops","support@dell.com")
c2.showCustomerEmail()
c2.showCustomerId()
c2.showCustomerName()