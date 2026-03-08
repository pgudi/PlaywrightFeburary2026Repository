/*
  0 1 1 2 3 5 8 13 21 34 55
  third =firstnum+secondnum
*/

let fn=0
let sn=1
console.log(fn)
console.log(sn);

for(let i=1;i<=10;i++){
   let tn=fn+sn
   console.log(tn);
   
   fn=sn
   sn=tn
}