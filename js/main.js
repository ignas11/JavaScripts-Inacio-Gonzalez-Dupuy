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
    fernet: {
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

// Funciones esenciales del proceso a simular:

function capturarEntradas() {
    nombreCliente = document.getElementById('nombre').value;
    edadCliente = parseInt(document.getElementById('edad').value);
    if (validarEntrada()) {
        document.getElementById('cliente-form').classList.add('hidden');
        alert(`Bienvenido, ${nombreCliente}! Ahora puedes agregar productos a tu carrito.`);
    }
}

function validarEntrada() {
    if (nombreCliente.trim() === '' || isNaN(edadCliente) || edadCliente <= 0) {
        alert("Por favor, ingrese un nombre válido y una edad válida.");
        return false;
    }
    if (edadCliente < 18) {
        alert("Debe ser mayor de edad para comprar alcohol.");
        return false;
    }
    return true;
}

// Función ficticia para simular una llamada asincrónica de verificación de inventario
function verificarInventario(producto) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulamos que siempre hay inventario disponible
            resolve(true);
        }, 1000); // Simulamos una espera de 1 segundo
    });
}

async function agregarProducto(producto) {
    if (!nombreCliente || !edadCliente) {
        alert("Por favor, ingrese su nombre y edad antes de agregar productos al carrito.");
        return;
    }

    const cantidad = parseInt(document.getElementById(`cantidad-${producto}`).value);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingrese una cantidad válida.");
        return;
    }

    try {
        const inventarioDisponible = await verificarInventario(producto);
        if (inventarioDisponible) {
            for (let i = 0; i < cantidad; i++) {
                productosEnCarrito.push(producto);
            }
            actualizarCarrito();
        } else {
            alert("Lo sentimos, no hay suficiente inventario disponible.");
        }
    } catch (error) {
        console.error("Error al verificar el inventario:", error);
        alert("Ocurrió un error al verificar el inventario. Por favor, intente de nuevo más tarde.");
    }
}

function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    productosEnCarrito.forEach((producto, index) => {
        const li = document.createElement('li');
        li.textContent = `${productos[producto].nombre} - $${productos[producto].precio}`;

        // Agregar botón de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.className = "btn btn-danger btn-sm ms-2";
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
    limpiarLocalStorage();
}

function guardarEnLocalStorage() {
    localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
    localStorage.setItem('totalCompra', totalCompra.toFixed(2));
}

function limpiarLocalStorage() {
    localStorage.removeItem('productosEnCarrito');
    localStorage.removeItem('totalCompra');
}
