
// Artículos iniciales que tienen pocas existencias 5 o menos
let listaStockBajo = [
  {
    codigo: "C005",
    nombre: "Corrector líquido o en cinta",
    categoria: "Escritura y corrección",
    precio: 24.00,
    existencias: 3,
    imagen: "img/Corrector liquido.jpg"
  },
  {
    codigo: "C012",
    nombre: "Tijeras",
    categoria: "Corte, pegado y medición",
    precio: 35.00,
    existencias: 4,
    imagen: "img/Tijeras.jpg"
  }
];

// Al cargar la pagina se ponen las tarjetas de existencias bajas y se activa el formulario
window.onload = function () {
  mostrarStockBajo();

  const formulario = document.getElementById("formRegistroProducto");
  const btnLimpiar = document.getElementById("btnLimpiarForm");
  const cajaResultado = document.getElementById("resultadoRegistro");

  // Boton para limpiar campos y quitar bordes rojos/verdes
  btnLimpiar.onclick = function () {
    const campos = formulario.querySelectorAll(".form-control, .form-select");
    for (let i = 0; i < campos.length; i++) {
      campos[i].classList.remove("is-valid", "is-invalid");
    }
    cajaResultado.classList.add("d-none");
  };

  // Validacion al presionar Registrar Producto
  formulario.onsubmit = function (event) {
    event.preventDefault(); // no deja q la se recargue al enviar

    // 1 Captura los 7 elementos del HTML por su ID
    const inputCodigo = document.getElementById("prodCodigo");
    const inputNombre = document.getElementById("prodNombre");
    const inputCategoria = document.getElementById("prodCategoria");
    const inputPrecio = document.getElementById("prodPrecio");
    const inputExistencias = document.getElementById("prodExistencias");
    const inputDescripcion = document.getElementById("prodDescripcion");
    const inputImagen = document.getElementById("prodImagen");

    // 2 Lee lo que escribio e usuario
    const codigo = inputCodigo.value.trim().toUpperCase();
    const nombre = inputNombre.value.trim();
    const categoria = inputCategoria.value;
    const precio = Number(inputPrecio.value);
    const existencias = Number(inputExistencias.value);
    const descripcion = inputDescripcion.value.trim();
    const archivoImagen = inputImagen.files[0];

    let formularioValido = true;

    // VALIDACIONES DE CADA CAMPO 

    // Codigo con formato C seguido de 3 nums
    const formatoCodigo = /^C\d{3}$/;
    if (codigo === "") {
      marcarError(inputCodigo, "El código del producto es obligatorio.");
      formularioValido = false;
    } else if (!formatoCodigo.test(codigo)) {
      marcarError(inputCodigo, "Formato inválido. Usa la letra C y 3 números (ej. C016).");
      formularioValido = false;
    } else {
      marcarValido(inputCodigo);
    }

    // Nombre solo letras o espacios
    const soloLetras = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/;
    if (nombre === "") {
      marcarError(inputNombre, "El nombre del producto es obligatorio.");
      formularioValido = false;
    } else if (!soloLetras.test(nombre)) {
      marcarError(inputNombre, "El nombre solo debe contener letras y espacios.");
      formularioValido = false;
    } else {
      marcarValido(inputNombre);
    }

    // Categoria
    if (categoria === "") {
      marcarError(inputCategoria, "Selecciona una categoría.");
      formularioValido = false;
    } else {
      marcarValido(inputCategoria);
    }

    // Precio numérico y mayor a 0
    if (inputPrecio.value.trim() === "" || isNaN(precio) || precio <= 0) {
      marcarError(inputPrecio, "El precio es obligatorio y debe ser mayor a 0.");
      formularioValido = false;
    } else {
      marcarValido(inputPrecio);
    }

    // Existencias entero y >= 0
    if (inputExistencias.value.trim() === "" || !Number.isInteger(existencias) || existencias < 0) {
      marcarError(inputExistencias, "Ingresa un número entero mayor o igual a 0.");
      formularioValido = false;
    } else {
      marcarValido(inputExistencias);
    }

    // Descripcion
    if (descripcion === "") {
      marcarError(inputDescripcion, "La descripción es obligatoria.");
      formularioValido = false;
    } else {
      marcarValido(inputDescripcion);
    }

    // Imagen
    if (!archivoImagen) {
      marcarError(inputImagen, "Selecciona una imagen para el producto.");
      formularioValido = false;
    } else {
      marcarValido(inputImagen);
    }

    // Si algún campo fallo se pone rojo y no cenvia
    if (!formularioValido) {
      cajaResultado.className = "alert alert-danger mt-4";
      cajaResultado.innerHTML = "<strong>Error:</strong> Corrige los campos marcados en rojo.";
      return;
    }

    // SI TODO TA BN

    // hace una ruta temporal para ver la imagen subida
    const urlImagen = URL.createObjectURL(archivoImagen);

    // muestra en pantalla los datos ingresados por el usuario
    cajaResultado.className = "alert alert-success mt-4";
    cajaResultado.innerHTML = `
      <h3 class="h5 fw-bold mb-3">Producto registrado — Datos ingresados:</h3>
      <div class="row align-items-center">
        <div class="col-md-3 text-center mb-3 mb-md-0">
          <img src="${urlImagen}" alt="Imagen de ${nombre}" class="img-fluid" style="max-height: 140px;">
        </div>
        <div class="col-md-9">
          <ul class="mb-0">
            <li><strong>Código:</strong> ${codigo}</li>
            <li><strong>Nombre:</strong> ${nombre}</li>
            <li><strong>Categoría:</strong> ${categoria}</li>
            <li><strong>Precio:</strong> $${precio.toFixed(2)} MXN</li>
            <li><strong>Existencias:</strong> ${existencias} unidades</li>
            <li><strong>Descripción:</strong> ${descripcion}</li>
          </ul>
        </div>
      </div>
    `;

    // Si el producto tiene 5 o menos existencias se pasaa a la sección de abajo
    if (existencias <= 5) {
      listaStockBajo.unshift({
        codigo: codigo,
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        existencias: existencias,
        imagen: urlImagen
      });
      mostrarStockBajo();
    }

    // Reinicia el formulario
    formulario.reset();
    const camposValidos = formulario.querySelectorAll(".is-valid");
    for (let i = 0; i < camposValidos.length; i++) {
      camposValidos[i].classList.remove("is-valid");
    }
  };
};

// Pone el borde rojo de Bootstrap y escribe el mensaje de error debajo del input
function marcarError(input, mensaje) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  const cajaError = input.parentElement.querySelector(".invalid-feedback");
  cajaError.textContent = mensaje;
}

// Pone el borde verde de Bootstrap cuando el dato es correcto
function marcarValido(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
}

// Recorre el arreglo listaStockBajo con un ciclo for y dibuja las tarjetas en el HTML
function mostrarStockBajo() {
  const contenedor = document.getElementById("contenedorStockBajo");
  const contador = document.getElementById("contadorStockBajo");

  contador.textContent = listaStockBajo.length + " alertas";

  let html = "";
  for (let i = 0; i < listaStockBajo.length; i++) {
    const prod = listaStockBajo[i];
    html += `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card border-danger h-100 shadow-sm">
          <div class="card-body d-flex align-items-center gap-3">
            <img src="${prod.imagen}" alt="${prod.nombre}" class="miniatura-tabla">
            <div>
              <span class="fw-bold text-danger">${prod.codigo}</span>
              <span class="badge bg-danger ms-2">Quedan ${prod.existencias} uds.</span>
              <h3 class="h6 fw-bold mt-1 mb-0">${prod.nombre}</h3>
              <small class="text-muted">${prod.categoria} &bull; $${prod.precio.toFixed(2)}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  contenedor.innerHTML = html;
}
