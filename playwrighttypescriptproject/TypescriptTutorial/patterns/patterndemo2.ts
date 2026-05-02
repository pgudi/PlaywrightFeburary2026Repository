export{}
let pattern:string=""
for(let i:number=1;i<=5;i++){
    for(let j:number=1;j<=i;j++){
        pattern=pattern+j+" "
    }
    pattern=pattern+"\n"
}

console.log(pattern);
