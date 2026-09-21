// Segmento 1: Productos (componentes) y estado del carrito
const productos = [
  { id: 1, nombre: "Memoria RAM 16GB DDR4", precio: 180000, categoria: "ram" },
  { id: 2, nombre: "Disco SSD NVMe 1TB", precio: 320000, categoria: "ssd" },
  { id: 3, nombre: "Batería de repuesto 4 celdas", precio: 150000, categoria: "bateria" },
  { id: 4, nombre: "Pantalla LED 15.6 pulgadas", precio: 420000, categoria: "pantalla" }
];

let carrito = [];

// Segmento 2: Selección de elementos del DOM
const listaproductos = document.getElementById("listaproductos");
const itemscarrito = document.getElementById("itemscarrito");
const totalcarrito = document.getElementById("totalcarrito");
const btnvaciarcarritto = document.querySelector(".btnvaciarcarritto");
const btncheckout = document.querySelector(".btncheckout");
const mensajecheckout = document.getElementById("mensajecheckout");

// Función para renderizar imágenes de los componentes
function crearsvgicono(categoria) {
  if (categoria === "ram") {
    return `<img src="img/ram.png" alt="RAM" class="iconoproductoimg">`;
  }
  if (categoria === "ssd") {
    return `<img src="img/ssd.png" alt="SSD" class="iconoproductoimg">`;
  }
  if (categoria === "bateria") {
    return `<img src="img/bateria.png" alt="Batería" class="iconoproductoimg">`;
  }
  return `<img src="img/pantalla.png" alt="Pantalla" class="iconoproductoimg">`;
}
// Renderizar el catálogo de productos
function renderproductos() {
  listaproductos.innerHTML = "";

  productos.forEach(function (producto) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjetaproducto";

    const icono = document.createElement("div");
    icono.className = "iconoproducto";
    icono.innerHTML = crearsvgicono(producto.categoria);

    const nombre = document.createElement("p");
    nombre.className = "nombreproducto";
    nombre.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.className = "precioproducto";
    precio.textContent = "$" + producto.precio.toLocaleString("es-CO");

    const boton = document.createElement("button");
    boton.className = "btnagregar";
    boton.textContent = "Agregar al carrito";
    boton.dataset.id = producto.id;

    tarjeta.appendChild(icono);
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(boton);

    listaproductos.appendChild(tarjeta);
  });
}

// Guardar y cargar en localStorage
function guardarcarrito() {
  localStorage.setItem("carritotienda", JSON.stringify(carrito));
}

function cargarcarrito() {
  const datosguardados = localStorage.getItem("carritotienda");

  if (datosguardados) {
    carrito = JSON.parse(datosguardados);
  }
}

// Calcular total acumulado
function calculartotal() {
  return carrito.reduce(function (acumulado, itemcarrito) {
    const producto = productos.find(function (p) {
      return p.id === itemcarrito.id;
    });

    if (!producto) {
      return acumulado;
    }

    return acumulado + producto.precio * itemcarrito.cantidad;
  }, 0);
}

// Renderizar contenido del carrito
function rendercarrito() {
  itemscarrito.innerHTML = "";

  if (carrito.length === 0) {
    itemscarrito.innerHTML = "<p class='carritovacio'>Tu carrito está vacío.</p>";
  }

  carrito.forEach(function (itemcarrito) {
    const producto = productos.find(function (p) {
      return p.id === itemcarrito.id;
    });

    if (!producto) {
      return;
    }

    const subtotal = producto.precio * itemcarrito.cantidad;

    const fila = document.createElement("div");
    fila.className = "itemcarritofila";
    fila.innerHTML =
      "<span class='nombreitem'>" + producto.nombre + "</span>" +
      "<div class='controlescantidad'>" +
      "<button class='btnrestar' data-id='" + producto.id + "'>-</button>" +
      "<span class='cantidaditem'>" + itemcarrito.cantidad + "</span>" +
      "<button class='btnsumar' data-id='" + producto.id + "'>+</button>" +
      "</div>" +
      "<span class='subtotalitem'>$" + subtotal.toLocaleString("es-CO") + "</span>" +
      "<button class='btneliminaritem' data-id='" + producto.id + "'>Eliminar</button>";

    itemscarrito.appendChild(fila);
  });

  totalcarrito.textContent = "$" + calculartotal().toLocaleString("es-CO");
  guardarcarrito();
}

// Agregar producto al carrito
function agregaralcarrito(idproducto) {
  const itemexistente = carrito.find(function (itemcarrito) {
    return itemcarrito.id === idproducto;
  });

  if (itemexistente) {
    itemexistente.cantidad = itemexistente.cantidad + 1;
  } else {
    carrito.push({ id: idproducto, cantidad: 1 });
  }

  rendercarrito();
}

// Listener para los botones "Agregar al carrito"
listaproductos.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".btnagregar");

  if (!boton) {
    return;
  }

  const idproducto = Number(boton.dataset.id);
  agregaralcarrito(idproducto);
});

// Listener para controles dentro del carrito (+, -, eliminar)
itemscarrito.addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");

  if (!boton) {
    return;
  }

  const idproducto = Number(boton.dataset.id);
  const itemcarrito = carrito.find(function (i) {
    return i.id === idproducto;
  });

  if (!itemcarrito) {
    return;
  }

  if (boton.classList.contains("btnsumar")) {
    itemcarrito.cantidad = itemcarrito.cantidad + 1;
  } else if (boton.classList.contains("btnrestar")) {
    itemcarrito.cantidad = itemcarrito.cantidad - 1;

    if (itemcarrito.cantidad <= 0) {
      carrito = carrito.filter(function (i) {
        return i.id !== idproducto;
      });
    }
  } else if (boton.classList.contains("btneliminaritem")) {
    carrito = carrito.filter(function (i) {
      return i.id !== idproducto;
    });
  }

  rendercarrito();
});

// Botón vaciar carrito
btnvaciarcarritto.addEventListener("click", function () {
  carrito = [];
  mensajecheckout.textContent = "";
  rendercarrito();
});

// Botón checkout
btncheckout.addEventListener("click", function () {
  if (carrito.length === 0) {
    mensajecheckout.textContent = "Agrega productos al carrito antes de finalizar la compra.";
    mensajecheckout.className = "mensajecheckout error";
    return;
  }

  const totalpagado = calculartotal();

  mensajecheckout.textContent = "Compra confirmada por $" + totalpagado.toLocaleString("es-CO") + ". Gracias por tu compra.";
  mensajecheckout.className = "mensajecheckout exito";

  carrito = [];
  rendercarrito();
});

// Inicialización de la app
cargarcarrito();
renderproductos();
rendercarrito();