class Maths1{
    addition(x,y){
        console.log("Addition Result :"+(x + y));
        
    }
}

class Maths2 extends Maths1{
    substraction(x,y){
        console.log("Substraction Result :"+(x - y));
        
    }
}

class Maths3 extends Maths1{
    division(x,y){
        console.log("division Result :"+(x/y));
        
    }
}

class Maths4 extends Maths3{
    multiplication(x,y){
        console.log("Multiplication Result :"+(x * y));
        
    }
}

let o1=new Maths2()
o1.addition(30,40)
o1.substraction(100,40)

let o2=new Maths4()
o2.addition(20,50)
o2.division(50,10)
o2.multiplication(12,10)

