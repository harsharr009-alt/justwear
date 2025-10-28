// ✅ CART STORAGE FUNCTIONS
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ✅ HOME PAGE LOGIC
if (document.querySelector(".addToCart")) {
  const addBtns = document.querySelectorAll(".addToCart");
  const cartCount = document.getElementById("cartCount");

  let cart = getCart();
  updateCount();

  addBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const name = card.querySelector("h3").innerText;
      const price = parseInt(card.querySelector("p").innerText.replace("₹", ""));
      const existing = cart.find(item => item.name === name);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      saveCart(cart);
      updateCount();
      alert(`${name} added to cart!`);
    });
  });

  function updateCount() {
    cartCount.textContent = getCart().reduce((sum, item) => sum + item.qty, 0);
  }
}

// ✅ CART PAGE LOGIC
if (document.getElementById("cartContainer")) {
  const cartContainer = document.getElementById("cartContainer");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");
  const okBtn = document.getElementById("okBtn");

  let cart = getCart();
  renderCart();

  function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.textContent = "0";
      return;
    }

    cart.forEach((item, i) => {
      total += item.price * item.qty;
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <h3>${item.name}</h3>
        <div>
          <button class="qty-btn" data-index="${i}" data-action="dec">−</button>
          <p>${item.qty}</p>
          <button class="qty-btn" data-index="${i}" data-action="inc">+</button>
        </div>
        <p>₹${item.price * item.qty}</p>
        <button class="qty-btn" data-index="${i}" data-action="remove">x</button>
      `;
      cartContainer.appendChild(div);
    });

    cartTotal.textContent = total;
    saveCart(cart);

    document.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", handleQty);
    });
  }

  function handleQty(e) {
    const index = e.target.dataset.index;
    const action = e.target.dataset.action;

    if (action === "inc") cart[index].qty++;
    if (action === "dec") cart[index].qty = Math.max(1, cart[index].qty - 1);
    if (action === "remove") cart.splice(index, 1);

    renderCart();
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    popup.style.display = "flex";
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
  });

  closePopup.addEventListener("click", () => popup.style.display = "none");
  okBtn.addEventListener("click", () => popup.style.display = "none");
}
// ---------- LOGIN SYSTEM ----------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");

function checkLogin() {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userName.textContent = `👋 Hello, ${user}`;
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userName.textContent = "";
  }
}
checkLogin();

loginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  alert("You have logged out!");
  checkLogin();
});
// ---------- VIEW ORDERS MODAL ----------
const modal = document.getElementById("orderModal");
const closeModal = document.querySelector(".closeModal");
const orderSummary = document.getElementById("orderSummary");
const viewOrdersBtn = document.getElementById("viewOrdersBtn");

viewOrdersBtn.addEventListener("click", () => {
  const orders = JSON.parse(localStorage.getItem("justwearOrders")) || [];
  if (orders.length === 0) {
    orderSummary.innerHTML = "<p>No orders available.</p>";
  } else {
    orderSummary.innerHTML = orders.map((o, i) => `
      <div class="order-card">
        <p><strong>User:</strong> ${o.user}</p>
        <p><strong>Items:</strong> ${o.items.map(it => `${it.name} (x${it.qty})`).join(", ")}</p>
        <p><strong>Payment:</strong> ${o.payment}</p>
        <p><strong>Address:</strong> ${o.address}</p>
        <p><strong>Date:</strong> ${o.date}</p>
      </div>
    `).join("<hr>");
  }
  modal.style.display = "block";
});

closeModal.addEventListener("click", () => modal.style.display = "none");

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

