
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