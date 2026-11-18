if (sessionStorage.getItem("clipcontrol-admin") !== "true") {
  window.location.replace("admin.html");
}

const products = [
  { code: "C001", name: "Bolígrafo (pluma) punto mediano", category: "Escritura y corrección", price: 7, stock: 48, minimum: 12 },
  { code: "C002", name: "Lápiz de grafito No. 2", category: "Escritura y corrección", price: 6, stock: 65, minimum: 15 },
  { code: "C003", name: "Goma de borrar blanca", category: "Escritura y corrección", price: 8, stock: 32, minimum: 10 },
  { code: "C004", name: "Sacapuntas con depósito", category: "Escritura y corrección", price: 15, stock: 19, minimum: 8 },
  { code: "C005", name: "Corrector líquido o en cinta", category: "Escritura y corrección", price: 35, stock: 11, minimum: 12 },
  { code: "C006", name: "Marcatextos fluorescente", category: "Escritura y corrección", price: 18, stock: 27, minimum: 8 },
  { code: "C007", name: "Cuaderno profesional (100 hojas)", category: "Papel y organización", price: 35, stock: 40, minimum: 12 },
  { code: "C008", name: "Paquete de hojas blancas (100 pzas)", category: "Papel y organización", price: 45, stock: 14, minimum: 15 },
  { code: "C009", name: "Block de notas adhesivas (Post-it)", category: "Papel y organización", price: 22, stock: 23, minimum: 8 },
  { code: "C010", name: "Carpeta / Fólder tamaño carta", category: "Papel y organización", price: 6, stock: 84, minimum: 18 },
  { code: "C011", name: "Caja de clips metálicos (100 pzas)", category: "Papel y organización", price: 16, stock: 9, minimum: 10 },
  { code: "C012", name: "Tijeras escolares punta roma", category: "Corte, pegado y medición", price: 25, stock: 16, minimum: 8 },
  { code: "C013", name: "Pegamento en barra (20 g)", category: "Corte, pegado y medición", price: 28, stock: 30, minimum: 10 },
  { code: "C014", name: "Cinta adhesiva transparente", category: "Corte, pegado y medición", price: 20, stock: 21, minimum: 8 },
  { code: "C015", name: "Regla de plástico o aluminio (30 cm)", category: "Corte, pegado y medición", price: 22, stock: 18, minimum: 20 }
];

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function renderInventory() {
  const search = document.getElementById("search").value.trim().toLowerCase();
  const lowOnly = document.getElementById("lowFilter").checked;
  const filtered = products.filter((product) => {
    const matchesSearch = `${product.code} ${product.name}`.toLowerCase().includes(search);
    const isLow = product.stock <= product.minimum;
    return matchesSearch && (!lowOnly || isLow);
  });

  document.getElementById("productRows").innerHTML = filtered.map((product) => `
    <tr class="${product.stock <= product.minimum ? "table-warning" : ""}">
      <td>${escapeHTML(product.code)}</td>
      <td>${escapeHTML(product.name)}</td>
      <td>${escapeHTML(product.category)}</td>
      <td>${currency.format(product.price)}</td>
      <td>${product.stock} <span class="small text-secondary">(mín. ${product.minimum})</span></td>
      <td class="text-nowrap">
        <button class="btn btn-outline-primary btn-sm" data-action="add" data-code="${escapeHTML(product.code)}">+1</button>
        <button class="btn btn-outline-secondary btn-sm" data-action="remove" data-code="${escapeHTML(product.code)}" ${product.stock === 0 ? "disabled" : ""}>−1</button>
        <button class="btn btn-outline-danger btn-sm" data-action="delete" data-code="${escapeHTML(product.code)}">Eliminar</button>
      </td>
    </tr>`).join("");

  document.getElementById("emptyMessage").classList.toggle("d-none", filtered.length > 0);
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalUnits").textContent = products.reduce((sum, product) => sum + product.stock, 0);
  document.getElementById("lowCount").textContent = products.filter((product) => product.stock <= product.minimum).length;
  const value = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  document.getElementById("inventoryValue").textContent = currency.format(value);
}

document.getElementById("logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("clipcontrol-admin");
  window.location.href = "admin.html";
});

document.getElementById("toggleProductForm").addEventListener("click", () => {
  document.getElementById("productForm").classList.toggle("d-none");
});

document.getElementById("cancelProduct").addEventListener("click", () => {
  const form = document.getElementById("productForm");
  form.reset();
  form.classList.remove("was-validated");
  form.classList.add("d-none");
  document.getElementById("productMessage").textContent = "";
});

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById("productMessage");
  message.textContent = "";
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;

  const code = document.getElementById("code").value.trim().toUpperCase();
  if (products.some((product) => product.code.toLowerCase() === code.toLowerCase())) {
    message.textContent = "Ese código ya está registrado.";
    return;
  }

  products.push({
    code,
    name: document.getElementById("name").value.trim(),
    category: document.getElementById("category").value.trim(),
    price: Number(document.getElementById("price").value),
    stock: Number(document.getElementById("stock").value),
    minimum: Number(document.getElementById("minimum").value)
  });
  form.reset();
  form.classList.remove("was-validated");
  form.classList.add("d-none");
  renderInventory();
});

document.getElementById("productRows").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const product = products.find((item) => item.code === button.dataset.code);
  if (!product) return;
  if (button.dataset.action === "add") product.stock++;
  if (button.dataset.action === "remove") product.stock = Math.max(0, product.stock - 1);
  if (button.dataset.action === "delete") {
    if (!confirm(`¿Eliminar ${product.name}?`)) return;
    products.splice(products.indexOf(product), 1);
  }
  renderInventory();
});

document.getElementById("search").addEventListener("input", renderInventory);
document.getElementById("lowFilter").addEventListener("change", renderInventory);

renderInventory();
