let marks:number=36

if(marks>=70 && marks<=100){
    console.log("Result is FCD!!!");
}else if(marks>=60 && marks<70){
    console.log("Result is First Class!!!");
}else if(marks>=50 && marks<60){
    console.log("Result is Second Class!!!");
}else if(marks>=35 && marks<50){
    console.log("Result is Pass Class!!!");
}else if(marks>=0 && marks<35){
    console.log("Result has Failed !!!");
}else{
    console.log("Invalid Marks!!!");
}