let marks =360000

if(marks>=70 && marks<=100){
    console.log("The Result is First Class With Distinction!!!" );
    
}else if(marks<70 && marks>=60){
     console.log("The Result is First Class !!!" );
} else if(marks<60 && marks>=50){
    console.log("The Result is Second Class !!!" );
}else if(marks<50 && marks>=35){
    console.log("The Result is Pass Class !!!" );
}else if(marks<35 && marks>=0){
    console.log("The Result ha failed !!!" );
}
else{
    console.log("Invalid Marks");
    
}