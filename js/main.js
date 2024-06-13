// Variables de JS necesarias:
let nombreCliente;
let edadCliente;
let productosEnCarrito = [];
let totalCompra = 0;
let productos = {}; // Inicialmente vacío, se llenará con datos del JSON

// Cargar datos del localStorage al cargar la página
window.addEventListener('load', function() {
    if (localStorage.getItem('productosEnCarrito')) {
        productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito'));
        totalCompra = parseFloat(localStorage.getItem('totalCompra'));
        actualizarCarrito();
    }
    cargarProductos();
});

// Función para cargar productos desde el archivo JSON
function cargarProductos() {
    fetch('/productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data.productos.reduce((acc, producto) => {
                acc[producto.id] = producto;
                return acc;
            }, {});
            mostrarProductos();
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Función para mostrar los productos en la página
function mostrarProductos() {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    Object.values(productos).forEach(producto => {
        const productCard = `
            <div class="col-lg-3 col-md-4 col-sm-6 card-container">
                <div class="card">
                    <img src="${producto.imagen}" class="card-img-top img-bebidas" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Precio: $${producto.precio}</p>
                        <input type="number" class="form-control mb-2" id="cantidad-${producto.id}" placeholder="Cantidad">
                        <button class="btn btn-primary" onclick="agregarProducto('${producto.id}')">Agregar al Carrito</button>
                    </div>
                </div>
            </div>`;
        productsContainer.insertAdjacentHTML('beforeend', productCard);
    });
}

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

// Ejemplo de uso de Luxon (manejo de fechas)
const DateTime = luxon.DateTime;
const ahora = DateTime.now();
console.log("Fecha y hora actual:", ahora.toString());

// Simulación de inventario
function verificarInventario(productoId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Suponemos que siempre hay inventario suficiente para simplificar
            resolve(true);
        }, 500);
    });
}

// Función para agregar productos al carrito
async function agregarProducto(producto) {
    const cantidad = parseInt(document.getElementById(`cantidad-${producto}`).value);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingrese una cantidad válida.");
        return;
    }

    const hayInventario = await verificarInventario(producto);
    if (hayInventario) {
        const productoObj = productos[producto];
        productosEnCarrito.push({ ...productoObj, cantidad });
        totalCompra += productoObj.precio * cantidad;
        actualizarCarrito();
        guardarDatos();
    } else {
        alert(`Lo sentimos, no tenemos suficiente inventario de ${producto}.`);
    }
}

function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cart = document.getElementById('cart');
    const total = document.getElementById('total');
    cartItems.innerHTML = '';
    productosEnCarrito.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio * item.cantidad}`;
        cartItems.appendChild(cartItem);
    });
    total.textContent = totalCompra.toFixed(2);
    cart.classList.remove('hidden');
}

function guardarDatos() {
    localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
    localStorage.setItem('totalCompra', totalCompra.toFixed(2));
}

// Evento para el botón de realizar compra
document.getElementById('checkout').addEventListener('click', function() {
    if (productosEnCarrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Verificar que los productos estén en inventario
    Promise.all(productosEnCarrito.map(item => verificarInventario(item.id)))
        .then(results => {
            if (results.every(hayInventario => hayInventario)) {
                alert(`Compra realizada con éxito. Total: $${totalCompra.toFixed(2)}`);
                productosEnCarrito = [];
                totalCompra = 0;
                actualizarCarrito();
                guardarDatos();
            } else {
                alert("Uno o más productos no tienen suficiente inventario.");
            }
        })
        .catch(error => console.error('Error en la verificación de inventario:', error));
});