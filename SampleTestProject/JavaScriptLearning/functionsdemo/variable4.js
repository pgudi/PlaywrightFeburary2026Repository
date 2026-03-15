/*
   variabel scope
   var -> functional level
   let  --> block level
   const  -> block level
*/

function show(){
    var x="Welcome"
    if(true){
        
        console.log("Inside If block :"+x);  
    }
    console.log("Inside Function :"+x);  
}
show();