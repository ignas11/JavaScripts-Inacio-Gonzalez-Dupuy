function paridad(number) {
    if(number % 2==0){
        console.log("El numero "+ number+" Es par")
    }else {
        console.log("El numero "+ number+" Es impar")
    }
}
function numeracion(number){
    for(let i =0; i<= number; i++){
        document.write(i+ "<br>")
    }
}
const number = parseInt(prompt("insert number"));
paridad(number)
numeracion(number)