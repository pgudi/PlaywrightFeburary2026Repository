function add1(x,y){
    return (x + y)
}

function sub1(x,y){
    return (x - y)
}

function multiplication(a,b){
    let result= (a * b)
    console.log("Multiplication Result :"+result);
    
}

//first approach
x=add1(10,5)
y=sub1(12,7)
multiplication(x,y)

//Second Approach
multiplication(add1(12,8), sub1(35,25))