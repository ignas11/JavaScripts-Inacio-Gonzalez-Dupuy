// Variables de JS necesarias:
let nombreCliente;
let edadCliente;
let productosEnCarrito = [];
let totalCompra = 0;

// Cargar datos del localStorage al cargar la página
window.addEventListener('load', function() {
    if (localStorage.getItem('productosEnCarrito')) {
        productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito'));
        totalCompra = parseFloat(localStorage.getItem('totalCompra'));
        actualizarCarrito();
    }
});

// Objetos de JS:
const productos = {
    cerveza: {
        nombre: "Cerveza",
        precio: 2500
    },
    vino: {
        nombre: "Vino",
        precio: 800
    },
    licor: {
        nombre: "Fernet",
        precio: 1500
    },
    vodka: {
        nombre: "Vodka",
        precio: 2000
    },
    gancia: {
        nombre: "Gancia",
        precio: 1200
    },
    ron: {
        nombre: "Ron",
        precio: 1800
    },
    whisky: {
        nombre: "Whisky",
        precio: 2500
    }
};

// Arrays y métodos de búsqueda y filtrado sobre el Array:
const productosDisponibles = Object.keys(productos);

function productoDisponible(producto) {
    return productosDisponibles.includes(producto);
}

// Funciones esenciales del proceso a simular:
document.getElementById('purchase-form').addEventListener('submit', function(event) {
    event.preventDefault();
    agregarAlCarrito();
});

function capturarEntradas() {
    nombreCliente = document.getElementById('nombre').value;
    edadCliente = parseInt(document.getElementById('edad').value);
}

function validarEntrada() {
    if (nombreCliente.trim() === '' || isNaN(edadCliente) || edadCliente <= 0) {
        alert("Por favor, ingrese un nombre válido y una edad válida.");
        return false;
    }
    return true;
}

function agregarAlCarrito() {
    capturarEntradas();
    if (validarEntrada()) {
        const productoSeleccionado = document.getElementById('producto').value;
        if (productoDisponible(productoSeleccionado)) {
            productosEnCarrito.push(productoSeleccionado);
            actualizarCarrito();
        } else {
            alert("El producto seleccionado no está disponible.");
        }
    }
}

function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    productosEnCarrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.textContent = productos[producto].nombre;

        // Agregar botón de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', function() {
            eliminarProductoDelCarrito(index);
        });

        li.appendChild(btnEliminar);
        cartItems.appendChild(li);
    });
    calcularTotalCompra();
    mostrarCarrito();
    // Guardar datos en localStorage
    guardarEnLocalStorage();
}

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(index) {
    productosEnCarrito.splice(index, 1);
    actualizarCarrito();
}

function calcularTotalCompra() {
    totalCompra = productosEnCarrito.reduce((total, producto) => total + productos[producto].precio, 0);
}

function mostrarCarrito() {
    const cartDiv = document.getElementById('cart');
    cartDiv.classList.remove('hidden');
    document.getElementById('total').textContent = totalCompra.toFixed(2);
}

document.getElementById('checkout').addEventListener('click', function() {
    realizarCompra();
});

function realizarCompra() {
    if (productosEnCarrito.length === 0) {
        alert("No hay productos en el carrito.");
        return;
    }
    const confirmarCompra = confirm(`¿Desea confirmar la compra por un total de $${totalCompra.toFixed(2)}?`);
    if (confirmarCompra) {
        // Aquí puedes agregar la lógica para finalizar la compra, por ejemplo, enviar los datos al servidor.
        mostrarResultado();
        reiniciarCompra();
    }
}

function mostrarResultado() {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `¡Gracias por tu compra, ${nombreCliente}! El total es: $${totalCompra.toFixed(2)}.`;
    resultDiv.classList.remove('hidden');
}

function reiniciarCompra() {
    nombreCliente = '';
    edadCliente = 0;
    productosEnCarrito = [];
    totalCompra = 0;
    document.getElementById('nombre').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('producto').selectedIndex = 0;
    document.getElementById('cart').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    // Limpiar localStorage al reiniciar la compra
    limpiarLocalStorage();
}

// Función para guardar datos en localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
    localStorage.setItem('totalCompra', totalCompra.toFixed(2));
}

// Función para limpiar datos de localStorage
function limpiarLocalStorage() {
    localStorage.removeItem('productosEnCarrito');
    localStorage.removeItem('totalCompra');
}