const form = document.getElementById("loginForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  form.classList.add("was-validated");
  const message = document.getElementById("loginMessage");
  message.classList.add("d-none");
  if (!form.checkValidity()) return;

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if (username !== "admin" || password !== "admin") {
    message.classList.remove("d-none");
    document.getElementById("password").value = "";
    return;
  }

  sessionStorage.setItem("clipcontrol-admin", "true");
  window.location.href = "admin-panel.html";
});
