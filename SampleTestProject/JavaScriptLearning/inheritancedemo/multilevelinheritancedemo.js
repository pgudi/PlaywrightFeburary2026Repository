class AA{
    constructor(){
        console.log("It is class AA constructor!!");
    }
}

class BB extends AA{
    constructor(){
        super()
        console.log("It is class BB constructor!!");
    }
}

class CC extends BB{
    constructor(){
        super()
       console.log("It is class CC constructor!!"); 
    }
}

let obj=new CC()
