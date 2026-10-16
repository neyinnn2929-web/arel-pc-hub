
const products = [
  {
    id: 1,
    name: "AMD Ryzen 5 5600G",
    category: "PC Components",
    price: 6299,
    emoji: "🧠",
    description: "6 cores, 12 threads, Radeon Graphics"
  },
  {
    id: 2,
    name: "MSI B550M PRO-VDH WIFI",
    category: "PC Components",
    price: 5895,
    emoji: "🧩",
    description: "AM4 motherboard with Wi-Fi"
  },
  {
    id: 3,
    name: "DDR4 16GB RAM",
    category: "PC Components",
    price: 1699,
    emoji: "▥",
    description: "3200MHz desktop memory"
  },
  {
    id: 4,
    name: "1TB NVMe SSD",
    category: "PC Components",
    price: 3299,
    emoji: "💾",
    description: "Fast M.2 storage"
  },
  {
    id: 5,
    name: "650W Power Supply",
    category: "PC Components",
    price: 2799,
    emoji: "⚡",
    description: "650W, 80+ Bronze rating"
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    category: "Peripherals",
    price: 1899,
    emoji: "⌨️",
    description: "RGB gaming keyboard"
  },
  {
    id: 7,
    name: "Wireless Gaming Mouse",
    category: "Peripherals",
    price: 999,
    emoji: "🖱️",
    description: "Wireless mouse with adjustable DPI"
  },
  {
    id: 8,
    name: "27-inch Gaming Monitor",
    category: "Monitors",
    price: 8999,
    emoji: "🖥️",
    description: "165Hz Full HD display"
  },
  {
    id: 9,
    name: "USB-C Hub",
    category: "Accessories",
    price: 1299,
    emoji: "🔌",
    description: "Multi-port connectivity"
  },
  {
    id: 10,
    name: "Gaming Headset",
    category: "Peripherals",
    price: 1499,
    emoji: "🎧",
    description: "Over-ear headset with microphone"
  },
  {
    id: 11,
    name: "ARGB Case Fans",
    category: "Accessories",
    price: 1099,
    emoji: "🌀",
    description: "Three 120mm RGB fans"
  },
  {
    id: 12,
    name: "Gaming PC Case",
    category: "Accessories",
    price: 2499,
    emoji: "🗄️",
    description: "Tempered glass computer case"
  }
];

let cart = {};
let orders = [];

const peso = amount =>
  "₱" + amount.toLocaleString("en-PH");

function renderProducts() {
  const search = document
    .getElementById("search")
    .value.toLowerCase();

  const category =
    document.getElementById("category").value;

  const sort = document.getElementById("sort").value;

  let filtered = products.filter(product => {
    const matchesSearch =
      (product.name + " " +
       product.category + " " +
       product.description)
        .toLowerCase()
        .includes(search);

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const grid = document.getElementById("productGrid");

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product">
      <div class="product-visual">
        ${product.emoji}
      </div>

      <div class="product-body">
        <p class="product-category">
          ${product.category}
        </p>

        <h3>${product.name}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">
          <span class="price">
            ${peso(product.price)}
          </span>

          <button class="add-button"
            onclick="addToCart(${product.id})">
            + Add
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
}

function changeQuantity(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  updateCart();
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
}

function updateCart() {
  const entries = Object.entries(cart);

  const count = entries.reduce(
    (sum, [, quantity]) => sum + quantity, 0
  );

  document.getElementById("cartCount").textContent = count;

  const total = entries.reduce((sum, [id, quantity]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + product.price * quantity;
  }, 0);

  document.getElementById("cartTotal").textContent = peso(total);

  const cartItems = document.getElementById("cartItems");

  if (entries.length === 0) {
    cartItems.innerHTML =
      '<p style="padding:25px 0;color:#9ab0c8">Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find(p => p.id === Number(id));

    return `
      <div class="cart-item">
        <strong>${product.name}</strong>
        <small>${peso(product.price)} each</small>

        <div class="cart-item-row">
          <div class="quantity-controls">
            <button onclick="changeQuantity(${id}, -1)">−</button>
            <span>${quantity}</span>
            <button onclick="changeQuantity(${id}, 1)">+</button>
          </div>

          <strong>${peso(product.price * quantity)}</strong>
        </div>

        <button onclick="removeFromCart(${id})"
          style="margin-top:10px">
          Remove
        </button>
      </div>
    `;
  }).join("");
}

function openCart() {
  updateCart();
  document.getElementById("cartOverlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("show");
}

function closeCartOutside(event) {
  if (event.target.id === "cartOverlay") {
    closeCart();
  }
}

function showCheckout() {
  if (Object.keys(cart).length === 0) {
    alert("Please add a product to your cart first.");
    return;
  }

  document.getElementById("checkoutForm")
    .classList.remove("hidden");
}

function showPage(page) {
  document.getElementById("homePage")
    .classList.toggle("hidden", page !== "home");

  document.getElementById("ordersPage")
    .classList.toggle("hidden", page !== "orders");

  if (page === "orders") {
    renderOrders();
  }

  closeCart();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("checkoutForm")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const formData = new FormData(this);

    const total = Object.entries(cart).reduce(
      (sum, [id, quantity]) => {
        const product = products.find(
          p => p.id === Number(id)
        );
        return sum + product.price * quantity;
      }, 0
    );

    const items = Object.entries(cart).map(([id, quantity]) => {
      const product = products.find(
        p => p.id === Number(id)
      );
      return `${product.name} × ${quantity}`;
    });

    const order = {
      id: "AR-" + Date.now().toString().slice(-6),
      name: formData.get("name"),
      email: formData.get("email"),
      address: formData.get("address"),
      payment: formData.get("payment"),
      total,
      items,
      date: new Date().toLocaleString()
    };

    orders.unshift(order);

    const notice = document.getElementById("orderNotice");
    notice.textContent =
      `Order ${order.id} placed successfully in this demo. ` +
      `Total: ${peso(total)}. No real payment was processed.`;

    notice.classList.remove("hidden");

    cart = {};
    updateCart();
    this.reset();
    renderOrders();
  });

function renderOrders() {
  const list = document.getElementById("ordersList");

  if (orders.length === 0) {
    list.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  list.innerHTML = orders.map(order => `
    <div class="order-card">
      <h3>Order ${order.id}</h3>
      <p>${order.date}</p>
      <p><strong>Customer:</strong> ${order.name}</p>
      <p><strong>Items:</strong> ${order.items.join(", ")}</p>
      <p><strong>Total:</strong> ${peso(order.total)}</p>
      <p><strong>Payment:</strong> ${order.payment}</p>
      <p style="color:#35d39a">Demo order placed</p>
    </div>
  `).join("");
}

renderProducts();
updateCart();
