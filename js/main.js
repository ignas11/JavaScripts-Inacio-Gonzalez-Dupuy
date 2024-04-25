// Variables de JS necesarias:

let nombreCliente;
let edadCliente;
let productoSeleccionado;
let totalCompra = 0;

// Objetos de JS:

const productos = {
    cerveza: {
        nombre: "Cerveza",
        precio: 2.5
    },
    vino: {
        nombre: "Vino",
        precio: 8
    },
    licor: {
        nombre: "Fernet",
        precio: 15
    }
};

// Arrays y métodos de búsqueda y filtrado sobre el Array:

const productosDisponibles = Object.keys(productos);

function productoDisponible(producto) {
    return productosDisponibles.includes(producto);
}

function obtenerProductosPorCategoria(categoria) {
    return productosDisponibles.filter(producto => productos[producto].categoria === categoria);
}

// Funciones esenciales del proceso a simular:

function capturarEntradas() {
    nombreCliente = prompt("Ingrese su nombre:");
    edadCliente = prompt("Ingrese su edad:");
    productoSeleccionado = prompt("Ingrese el producto que desea comprar (cerveza, vino, licor):");
}

function verificarEdad() {
    if (edadCliente < 18 && productoSeleccionado !== 'cerveza') {
        alert("Lo siento, debes ser mayor de edad para comprar este producto.");
        return false;
    }
    return true;
}

function calcularTotal() {
    totalCompra = productos[productoSeleccionado].precio;
}

function mostrarResultado() {
    alert(`¡Gracias por tu compra, ${nombreCliente}! El total es: $${totalCompra.toFixed(2)}.`);
}

function realizarCompra() {
    capturarEntradas();
    if (verificarEdad() && productoDisponible(productoSeleccionado)) {
        calcularTotal();
        mostrarResultado();
    } else {
        alert("Lo sentimos, el producto seleccionado no está disponible.");
    }
}
