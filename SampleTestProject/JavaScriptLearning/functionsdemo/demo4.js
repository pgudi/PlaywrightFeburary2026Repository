// Example 2: For the given array, assign elements into another array in reverse order?


function assignElementsInReverse(a){
    let b=[]
    for(let i=a.length-1;i>=0;i--){
        b.push(a[i])
    }
    //Read Eleemnts from array b
    for(let kk of b){
        console.log(kk);
        
    }
}

let arraydemo=[10,20,30,40,50,60]
assignElementsInReverse(arraydemo)