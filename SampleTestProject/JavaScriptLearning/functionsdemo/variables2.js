/*
   variabel scope
   var -> functional level
   let  --> block level
   const  -> block level
*/

function show(){
    if(true){
        let x="Welcome"
        console.log("Inside If block :"+x);  
    }
    console.log("Inside Function :"+x);  
}
show();