function getIntegerArray(){
    let even=[]
    for(let i=20;i<=40;i++){
        if(i % 2 ==0){
            even.push(i)
        }
    }
    return even;
}
//First Execution
let a=getIntegerArray()
console.log(a);
console.log("---------------------");

//Secodn Execution
//Fidn sum of All Elements
let sum=0
for(let i=0;i<a.length;i++){
    sum=sum+a[i]
}
console.log("Sum of All Elements :"+sum);
console.log("---------------------");
let b=getIntegerArray()
console.log(b);

//Third Execution, Print second half of eleemnts
let val=Number.parseInt(b.length/2)
console.log("Element :"+val);

for(let j=val;j<b.length;j++){
    console.log(b[j]);
    
}