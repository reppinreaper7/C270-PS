const prices = {
  apple: 0.5,
  pear: 0.6,
  orange: 0.75,
  grape: 0.4
};

let cart = JSON.parse(localStorage.getItem("cart")) || {};

const basket = document.getElementById("basket");
const totalEl = document.getElementById("total");
const basketCount = document.getElementById("basketCount");
const message = document.getElementById("message");

// Modal elements
const receiptModal = document.getElementById("receipt");
const receiptItemsEl = document.getElementById("receiptItems");
const receiptTotalEl = document.getElementById("receiptTotal");
const payMessageEl = document.getElementById("payMessage");

const receiptTitle = document.getElementById("receiptTitle");
const checkoutActions = document.getElementById("checkoutActions");
const backToCartBtn = document.getElementById("backToCartBtn");
const payBtn = document.getElementById("payBtn");

const okArea = document.getElementById("okArea");
const okBtn = document.getElementById("okBtn");

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function niceName(item) {
  return item.charAt(0).toUpperCase() + item.slice(1);
}

/* ADD ITEMS */
document.querySelectorAll("button[data-item]").forEach(btn => {
  btn.onclick = () => {
    const item = btn.dataset.item;
    const qty = parseInt(document.getElementById(`qty-${item}`).value);
    if (!qty || qty <= 0) return;

    cart[item] = (cart[item] || 0) + qty;
    save();
    render();
  };
});

/* RENDER BASKET (editable) */
function render() {
  basket.innerHTML = "";
  let total = 0;
  let count = 0;

  const items = Object.keys(cart);

  if (items.length === 0) {
    basket.innerHTML = "<p>Your basket is empty.</p>";
    totalEl.textContent = "$0.00";
    basketCount.textContent = "0 items";
    return;
  }

  items.forEach(item => {
    const qty = cart[item];
    const subtotal = qty * prices[item];

    total += subtotal;
    count += qty;

    const row = document.createElement("div");
    row.innerHTML = `
      <div>
        <strong>${niceName(item)}</strong>
        <button data-dec="${item}" ${qty === 1 ? "disabled" : ""}>−</button>
        <span>${qty}</span>
        <button data-inc="${item}">+</button>
        <button data-remove="${item}">Remove</button>
      </div>
      <span>$${subtotal.toFixed(2)}</span>
    `;
    basket.appendChild(row);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
  basketCount.textContent = `${count} item${count === 1 ? "" : "s"}`;

  // + button
  document.querySelectorAll("[data-inc]").forEach(btn => {
    btn.onclick = () => {
      const item = btn.dataset.inc;
      cart[item]++;
      save();
      render();
    };
  });
let cart = {};

if (typeof localStorage !== "undefined") {
  cart = JSON.parse(localStorage.getItem("cart")) || {};
}

  // - button
  document.querySelectorAll("[data-dec]").forEach(btn => {
    btn.onclick = () => {
      const item = btn.dataset.dec;
      cart[item]--;
      if (cart[item] <= 0) delete cart[item];
      save();
      render();
    };
  });

  // Remove with confirmation
  document.querySelectorAll("[data-remove]").forEach(btn => {
    btn.onclick = () => {
      const item = btn.dataset.remove;
      if (confirm(`Remove ${niceName(item)} from basket?`)) {
        delete cart[item];
        save();
        render();
      }
    };
  });
}

/* BUILD ORDER SUMMARY (non-editable) */
function buildOrderSummary() {
  receiptItemsEl.innerHTML = "";
  payMessageEl.textContent = "";

  receiptTitle.textContent = "Order Summary";
  checkoutActions.style.display = "flex";
  okArea.style.display = "none";

  let total = 0;
  const items = Object.keys(cart);

  items.forEach(item => {
    const qty = cart[item];
    const subtotal = qty * prices[item];
    total += subtotal;

    const line = document.createElement("div");
    line.style.display = "flex";
    line.style.justifyContent = "space-between";
    line.style.marginBottom = "8px";

    line.innerHTML = `
      <span>${niceName(item)} × ${qty}</span>
      <span>$${subtotal.toFixed(2)}</span>
    `;
    receiptItemsEl.appendChild(line);
  });

  receiptTotalEl.textContent = `$${total.toFixed(2)}`;
}

/* CHECKOUT */
document.getElementById("checkout").onclick = () => {
  if (Object.keys(cart).length === 0) return;
  buildOrderSummary();
  receiptModal.style.display = "block";
};

/* BACK TO CART */
backToCartBtn.onclick = () => {
  receiptModal.style.display = "none";
};

/* PAY */
payBtn.onclick = () => {
  // After paying: show thank you, show OK only
  receiptTitle.textContent = "Payment Successful";
  payMessageEl.textContent = "Thank you for shopping with us!";

  checkoutActions.style.display = "none";
  okArea.style.display = "block";

  // Clear cart after payment
  cart = {};
  save();
  render();
};

/* OK closes modal */
okBtn.onclick = () => {
  receiptModal.style.display = "none";
};

/* click outside closes modal ONLY if not paid yet */
window.onclick = (e) => {
  if (e.target === receiptModal && okArea.style.display === "none") {
    receiptModal.style.display = "none";
  }
};

render();
