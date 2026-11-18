const ofertas = [
  { nombre: "Caja de clips metálicos (100 pzas)", precio: 16.00, descuento: 15, imagen: "img/Clip.jpg",
    alt: "Caja de clips metálicos estándar", detalle: "El clásico de oficina, en caja de 100 piezas." },
  { nombre: "Goma de borrar blanca", precio: 8.00, descuento: 25, imagen: "img/Goma.jpg",
    alt: "Goma para borrar trazos", detalle: "Pieza de caucho o vinilo diseñada para eliminar trazos de lápiz sin dañar el papel." },
  { nombre: "Cuaderno profesional (100 hojas)", precio: 35.00, descuento: 20, imagen: "img/Cuadernos.jpg",
    alt: "Cuadernos con hojas rayadas", detalle: "Cuaderno de hojas rayadas, cuadriculadas o blancas unido por espiral o cosido para tomar apuntes." },
  { nombre: "Cinta adhesiva transparente", precio: 20.00, descuento: 10, imagen: "img/Cinta adhesiva.jpg",
    alt: "Cinta adhesiva", detalle: "Tira transparente con pegamento en una cara para reparar hojas o cerrar paquetes ligeros." }
];

const formatoMoneda = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

function crearCarrusel() {
  const slides = document.getElementById("slidesOfertas");
  const indicadores = document.getElementById("indicadoresOfertas");
  if (!slides || !indicadores) return;

  ofertas.forEach((p, i) => {
    const precioFinal = p.precio * (1 - p.descuento / 100);
    const activo = i === 0;

    indicadores.insertAdjacentHTML("beforeend",
      `<button type="button" data-bs-target="#carruselOfertas" data-bs-slide-to="${i}"
        ${activo ? 'class="active" aria-current="true"' : ""} aria-label="Oferta ${i + 1}"></button>`);

    slides.insertAdjacentHTML("beforeend", `
      <div class="carousel-item ${activo ? "active" : ""}" data-bs-interval="5000">
        <div class="slide-oferta">
          <div class="row align-items-center g-3 text-center text-md-start">
            <div class="col-md-5 text-center">
              <img src="${p.imagen}" alt="${p.alt}" class="img-fluid">
            </div>
            <div class="col-md-7">
              <span class="badge badge-oferta mb-2">-${p.descuento}% de descuento</span>
              <h3 class="h4">${p.nombre}</h3>
              <p class="mb-2">${p.detalle}</p>
              <p class="mb-3">
                <span class="precio-anterior me-2">${formatoMoneda.format(p.precio)}</span>
                <span class="precio-oferta">${formatoMoneda.format(precioFinal)}</span>
              </p>
              <a href="catalogo.html" class="btn btn-clip">Ver en el catálogo</a>
            </div>
          </div>
        </div>
      </div>`);
  });
}

document.addEventListener("DOMContentLoaded", crearCarrusel);

//js para el catalogo

function aplicarOfertasCatalogo() {
  const tarjetas = document.querySelectorAll(".card");
  if (!tarjetas.length) return;

  tarjetas.forEach((card) => {
    const tituloEl = card.querySelector(".card-title");
    const precioEl = card.querySelector(".text-success");
    if (!tituloEl || !precioEl) return;

    const nombreProducto = tituloEl.textContent.trim();
    const oferta = ofertas.find((o) => o.nombre === nombreProducto);

    if (oferta) {
      const precioFinal = oferta.precio * (1 - oferta.descuento / 100);
      precioEl.innerHTML = `
        ${formatoMoneda.format(precioFinal)}
        <small class="text-muted text-decoration-line-through fw-normal">${formatoMoneda.format(oferta.precio)}</small>
        <span class="badge bg-warning text-dark ms-1">${oferta.descuento}% OFF</span>
      `;
    }
  });
}

document.addEventListener("DOMContentLoaded", aplicarOfertasCatalogo);

//js para registro
