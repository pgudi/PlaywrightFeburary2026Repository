
function getFactorial(num){
    if(num==1){
        return 1
    }
    return num * getFactorial(num-1)
}
/*
 5 * getFactroial(4)
 5 * 4 * getFactroial(3)
 5 * 4 * 3* getFactroial(2)
 5 * 4 * 3* 2 * getFactroial(1)
*/

console.log(getFactorial(5));
