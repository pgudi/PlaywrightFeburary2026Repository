
let num=10
function printNumbers(){
    console.log(num);

    if(num<=20){
        num=num+1
        printNumbers()
    }
    
}

printNumbers()