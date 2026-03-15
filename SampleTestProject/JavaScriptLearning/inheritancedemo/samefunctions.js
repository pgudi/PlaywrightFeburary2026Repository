class MetroCity{
    showCityName(cityname){
        console.log("the Metro City Name is "+cityname)
    }
}

class CapitalCity extends MetroCity{
   
    showCityName(cityname){
        console.log("the Capital City Name is "+cityname)
    }
}

class Village extends MetroCity{
    showCityName(cityname){
        console.log("the Village Name is "+cityname)
    }
}

let obj=new MetroCity()
obj.showCityName("Bangalore")

obj=new CapitalCity()
obj.showCityName("Mumbai")

obj=new Village()
obj.showCityName("Doddanahalli")
