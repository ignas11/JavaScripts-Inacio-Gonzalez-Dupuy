// Variables de JS necesarias:
let nombreCliente;
let edadCliente;
let productosEnCarrito = [];
let totalCompra = 0;
let productos = {}; // Inicialmente vacío, se llenará con datos del JSON

// Cargar datos del localStorage al cargar la página
window.addEventListener('load', function () {
    if (localStorage.getItem('productosEnCarrito')) {
        productosEnCarrito = JSON.parse(localStorage.getItem('productosEnCarrito'));
        totalCompra = parseFloat(localStorage.getItem('totalCompra'));
        actualizarCarrito();
    }
    cargarProductos();
});

// Función para cargar productos desde el archivo JSON
function cargarProductos() {
    fetch('./productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            productos = data.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {});
            mostrarProductos(data);
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Función para mostrar los productos en la página
function mostrarProductos(data) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    data.forEach(producto => {
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
        // Alerta SweetAlert2 de bienvenida
        Swal.fire({
            icon: 'success',
            title: `Bienvenido, ${nombreCliente}!`,
            text: 'Ahora puedes agregar productos a tu carrito.',
            confirmButtonText: 'Entendido'
        });
    }
}

function validarEntrada() {
    if (nombreCliente.trim() === '' || isNaN(edadCliente) || edadCliente <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Datos inválidos',
            text: 'Por favor, ingrese un nombre válido y una edad válida.'
        });
        return false;
    }
    if (edadCliente < 18) {
        Swal.fire({
            icon: 'error',
            title: 'Edad insuficiente',
            text: 'Debe ser mayor de edad para comprar alcohol.'
        });
        return false;
    }
    return true;
}

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
async function agregarProducto(productoId) {
    const cantidad = parseInt(document.getElementById(`cantidad-${productoId}`).value);
    if (isNaN(cantidad) || cantidad <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad inválida',
            text: 'Por favor, ingrese una cantidad válida.'
        });
        return;
    }

    const hayInventario = await verificarInventario(productoId);
    if (hayInventario) {
        const productoObj = productos[productoId];
        productosEnCarrito.push({ ...productoObj, cantidad });
        totalCompra += productoObj.precio * cantidad;
        actualizarCarrito();
        guardarDatos();

        // Mostrar fecha y hora de la operación usando funciones estándar de JavaScript
        const ahora = new Date().toLocaleString();
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `${productoObj.nombre} ha sido agregado al carrito.\nFecha y hora: ${ahora}`
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Inventario insuficiente',
            text: `Lo sentimos, no tenemos suficiente inventario de ${productoId}.`
        });
    }
}

function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cart = document.getElementById('cart');
    const total = document.getElementById('total');
    cartItems.innerHTML = '';
    productosEnCarrito.forEach((item, index) => {
        const cartItem = document.createElement('li');
        cartItem.className = 'list-group-item';
        cartItem.innerHTML = `
            ${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${(item.precio * item.cantidad).toFixed(2)}
            <button class="btn btn-danger btn-sm float-right" onclick="eliminarProducto(${index})">Eliminar</button>
        `;
        cartItems.appendChild(cartItem);
    });
    total.textContent = totalCompra.toFixed(2);
    cart.classList.remove('hidden');
}

function guardarDatos() {
    localStorage.setItem('productosEnCarrito', JSON.stringify(productosEnCarrito));
    localStorage.setItem('totalCompra', totalCompra.toFixed(2));
}

function eliminarProducto(index) {
    const item = productosEnCarrito[index];
    totalCompra -= item.precio * item.cantidad;
    productosEnCarrito.splice(index, 1);
    actualizarCarrito();
    guardarDatos();
}

// Evento para el botón de realizar compra
document.getElementById('checkout').addEventListener('click', function () {
    if (productosEnCarrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'El carrito está vacío.'
        });
        return;
    }

    // Verificar que los productos estén en inventario
    Promise.all(productosEnCarrito.map(item => verificarInventario(item.id)))
        .then(results => {
            if (results.every(hayInventario => hayInventario)) {
                Swal.fire({
                    icon: 'success',
                    title: 'Compra realizada',
                    text: `Felicidades, se pudo realizar su compra. Total: $${totalCompra.toFixed(2)}`
                });
                productosEnCarrito = [];
                totalCompra = 0;
                actualizarCarrito();
                guardarDatos();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Inventario insuficiente',
                    text: 'Uno o más productos no tienen suficiente inventario.'
                });
            }
        })
        .catch(error => {
            console.error('Error en la verificación de inventario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al procesar la compra. Por favor, inténtalo de nuevo.'
            });
        });
});