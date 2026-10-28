/* ---------- Data ---------- */
const KES = n => "KSh " + n.toLocaleString("en-KE");
// To use your own photo, add  image: "https://your-url.jpg"  to a product.
const PRODUCTS = [
  { id: 1, name: "Handwoven Kiondo Basket", cat: "Baskets", price: 2800, old: 3500, seed: "kiondo-basket",
    desc: "A classic Kenyan kiondo woven from sisal with leather handles. Strong, stylish and perfect for the market or the beach.",
    details: ["Sisal with genuine leather handles", "Made by a women's group near Kisumu", "Width about 30 cm"],
    image: "kiondo.avif"
  },
  { id: 2, name: "Kisii Soapstone Elephant", cat: "Decor", price: 1800, seed: "soapstone-elephant",
    desc: "Hand-carved from soft Kisii soapstone, each piece is slightly different and smooth to the touch.",
    details: ["Natural soapstone", "Hand-carved and polished", "Height about 12 cm"],
     image: "elephant soapstone.jpg" },
  { id: 3, name: "Beaded Collar Necklace", cat: "Jewellery", price: 1200, old: 1500, seed: "beaded-necklace",
    desc: "A bright beaded collar inspired by traditional Kenyan designs. Light, colourful and made to be noticed.",
    details: ["Glass beads on strong thread", "Adjustable fastening", "Handmade, colours may vary"],
    image: "bearded collar necklace.jpg" },
  { id: 4, name: "Kitenge Tote Bag", cat: "Fashion", price: 1600, seed: "kitenge-tote",
    desc: "A roomy tote sewn from vibrant kitenge fabric with a zipped inner pocket.",
    details: ["100% cotton kitenge", "Inner zip pocket", "Fits an A4 notebook and laptop"],
    image: "kitenge tote bag.jpg" },
  { id: 5, name: "Water Hyacinth Placemats (Set of 4)", cat: "Home", price: 2200, seed: "hyacinth-placemats",
    desc: "Woven from water hyacinth harvested from Lake Victoria, turning a problem weed into beautiful tableware.",
    details: ["Set of 4 placemats", "Eco-friendly and renewable", "Wipe clean"],
    image: "hycinthmats.jpg" },
  { id: 6, name: "Sisal Wall Hanging", cat: "Decor", price: 3200, old: 3900, seed: "sisal-wall-hanging",
    desc: "A large woven wall hanging that adds warmth and texture to any room.",
    details: ["Natural and dyed sisal", "Wooden hanging rod included", "Width about 60 cm"],
    image: "sisal wall hanging.jxl" },
  { id: 7, name: "Leather Akala Sandals", cat: "Fashion", price: 1500, seed: "akala-sandals",
    desc: "Comfortable sandals with soles made from recycled tyres, a Kenyan favourite that lasts for years.",
    details: ["Leather upper", "Recycled tyre sole", "Sizes 36–45"],
    image: "akala.jpg" },
  { id: 8, name: "Hand-painted Ceramic Mugs (Pair)", cat: "Home", price: 2400, seed: "ceramic-mugs",
    desc: "Two sturdy mugs painted by hand with lake and sunrise patterns. A thoughtful gift.",
    details: ["Set of 2 mugs", "Dishwasher safe", "Capacity 350 ml"],
    image: "painted ceramic mugs.webp" }
];
const imgOf = (p, w = 600, h = 450) => p.image || `https://picsum.photos/seed/${p.seed}/${w}/${h}`;
const byId = id => PRODUCTS.find(p => p.id === Number(id));

/* ---------- Cart (saved in the browser) ---------- */
const KEY = "lakeside_cart";
const getCart = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const saveCart = c => { localStorage.setItem(KEY, JSON.stringify(c)); updateBadge(); };
function addToCart(id, qty = 1) {
  const cart = getCart();
  const line = cart.find(l => l.id === id);
  line ? line.qty += qty : cart.push({ id, qty });
  saveCart(cart);
}
function updateBadge() {
  const n = getCart().reduce((s, l) => s + l.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = n;
}
function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Shared layout ---------- */
function layout() {
  const page = document.body.dataset.page;
  const a = (href, key, label) => `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  document.getElementById("site-header").innerHTML =
    `<div class="bar"><a class="logo" href="index.html">🧺 Lakeside Crafts</a>
     <nav>${a("index.html", "home", "Shop")}${a("cart.html", "cart", 'Cart <span id="cart-count" class="badge">0</span>')}${a("contact.html", "contact", "Contact")}</nav></div>`;
  document.getElementById("site-footer").innerHTML =
    `<p>© ${new Date().getFullYear()} Lakeside Crafts, Kisumu, Kenya · <a href="contact.html">Contact us</a></p>
     <p class="small"> demo shop, no real payments.</p>`;
  updateBadge();
}

function card(p) {
  return `<article class="card">
    <a class="ph" href="product.html?id=${p.id}"><img loading="lazy" src="${imgOf(p)}" alt="${p.name}"></a>
    <div class="body"><span class="tag">${p.cat}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p class="price">${KES(p.price)}${p.old ? `<s>${KES(p.old)}</s>` : ""}</p>
      <button class="btn small" data-add="${p.id}">Add to cart</button></div></article>`;
}

/* ---------- Home page ---------- */
function initHome() {
  const grid = document.getElementById("grid"), chips = document.getElementById("chips");
  const search = document.getElementById("search"), empty = document.getElementById("empty");
  const cats = ["All", ...new Set(PRODUCTS.map(p => p.cat))];
  let cat = "All";
  chips.innerHTML = cats.map(c => `<button class="chip ${c === "All" ? "on" : ""}" data-cat="${c}">${c}</button>`).join("");
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    const list = PRODUCTS.filter(p => (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(q));
    grid.innerHTML = list.map(card).join("");
    empty.hidden = list.length > 0;
  };
  chips.addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    cat = b.dataset.cat;
    chips.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === b));
    draw();
  });
  search.addEventListener("input", draw);
  document.getElementById("news-form").addEventListener("submit", e => {
    e.preventDefault(); e.target.reset(); toast("Thanks for subscribing! Check your email for 10% off.");
  });
  draw();
}

/* ---------- Product page ---------- */
function initProduct() {
  const p = byId(new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
  document.title = p.name + " | Lakeside Crafts";
  document.getElementById("crumb").textContent = p.name;
  document.getElementById("product").innerHTML = `
    <div class="ph"><img src="${imgOf(p, 800, 600)}" alt="${p.name}"></div>
    <div>
      <span class="tag">${p.cat}</span>
      <h1>${p.name}</h1>
      <p class="price">${KES(p.price)}${p.old ? `<s>${KES(p.old)}</s>` : ""}</p>
      <p>${p.desc}</p>
      <ul>${p.details.map(d => `<li>${d}</li>`).join("")}</ul>
      <div class="buy">
        <div class="qty"><button id="minus" aria-label="Less">−</button><span id="q">1</span><button id="plus" aria-label="More">+</button></div>
        <button class="btn" id="add">Add to cart</button>
        <a class="btn ghost" href="cart.html">Go to cart</a>
      </div>
      <p class="muted small">Free delivery on orders over KSh 5,000 · 7-day returns</p>
    </div>`;
  let q = 1; const qEl = document.getElementById("q");
  document.getElementById("minus").onclick = () => { q = Math.max(1, q - 1); qEl.textContent = q; };
  document.getElementById("plus").onclick = () => { q++; qEl.textContent = q; };
  document.getElementById("add").onclick = () => { addToCart(p.id, q); toast(`${q} × ${p.name} added to cart`); };
  document.getElementById("related").innerHTML =
    PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat).concat(PRODUCTS.filter(x => x.id !== p.id && x.cat !== p.cat)).slice(0, 4).map(card).join("");
}

/* ---------- Cart page ---------- */
const FREE_OVER = 5000, DELIVERY = 300;
function initCart() {
  const box = document.getElementById("cart-items");
  const draw = () => {
    const cart = getCart();
    if (!cart.length) {
      box.innerHTML = `<div class="empty-cart"><p>Your cart is empty.</p><a class="btn" href="index.html">Start shopping</a></div>`;
      document.getElementById("summary").style.display = "none"; return;
    }
    document.getElementById("summary").style.display = "";
    box.innerHTML = cart.map(l => { const p = byId(l.id); return `
      <div class="item">
        <a class="ph" href="product.html?id=${p.id}"><img src="${imgOf(p, 200, 150)}" alt="${p.name}"></a>
        <div><h4>${p.name}</h4><span class="muted">${KES(p.price)} each</span><br>
          <button class="remove" data-del="${p.id}">Remove</button></div>
        <div style="text-align:right">
          <div class="qty"><button data-dec="${p.id}">−</button><span>${l.qty}</span><button data-inc="${p.id}">+</button></div>
          <p class="price">${KES(p.price * l.qty)}</p></div>
      </div>`; }).join("");
    const sub = cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
    const del = sub >= FREE_OVER ? 0 : DELIVERY;
    document.getElementById("subtotal").textContent = KES(sub);
    document.getElementById("delivery").textContent = del ? KES(del) : "Free";
    document.getElementById("total").textContent = KES(sub + del);
    draw.total = sub + del;
  };
  box.addEventListener("click", e => {
    const t = e.target; const cart = getCart();
    const find = id => cart.find(l => l.id === Number(id));
    if (t.dataset.inc) find(t.dataset.inc).qty++;
    else if (t.dataset.dec) { const l = find(t.dataset.dec); l.qty = Math.max(1, l.qty - 1); }
    else if (t.dataset.del) cart.splice(cart.indexOf(find(t.dataset.del)), 1);
    else return;
    saveCart(cart); draw();
  });

  const modal = document.getElementById("modal"), mbox = document.getElementById("modal-box");
  document.getElementById("checkout-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const phone = document.getElementById("c-phone").value.replace(/\s/g, "");
    const town = document.getElementById("c-town").value.trim();
    const err = document.getElementById("c-error");
    let msg = "";
    if (name.length < 2) msg = "Please enter your full name.";
    else if (!/^(?:\+254|254|0)[17]\d{8}$/.test(phone)) msg = "Enter a valid Kenyan M-Pesa number, e.g. 0712345678.";
    else if (town.length < 2) msg = "Please enter your delivery town.";
    err.hidden = !msg; err.textContent = msg;
    if (msg) return;
    mbox.innerHTML = `<h3>📱 Check your phone</h3>
      <p>An M-Pesa request for <strong>${KES(draw.total)}</strong> was sent to <strong>${phone}</strong>. Enter your PIN to pay.</p>
      <p class="muted small">Demo only: no money is charged.</p>
      <button class="btn full" id="paid">I have paid (demo)</button>
      <button class="btn full ghost" id="cancel">Cancel</button>`;
    modal.hidden = false;
    document.getElementById("cancel").onclick = () => modal.hidden = true;
    document.getElementById("paid").onclick = () => {
      const order = "LC-" + Math.floor(100000 + Math.random() * 900000);
      mbox.innerHTML = `<h3>✅ Order confirmed</h3><p>Thank you, ${name.split(" ")[0]}!</p>
        <p>Order number <strong>${order}</strong><br>We will deliver to <strong>${town}</strong> in 1–3 days.</p>
        <a class="btn full" href="index.html">Continue shopping</a>`;
      saveCart([]); draw();
    };
  });
  draw();
}

/* ---------- Contact page ---------- */
function initContact() {
  document.getElementById("contact-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("m-name").value.trim();
    const email = document.getElementById("m-email").value.trim();
    const msg = document.getElementById("m-msg").value.trim();
    const err = document.getElementById("m-error"), ok = document.getElementById("m-ok");
    let problem = "";
    if (name.length < 2) problem = "Please enter your name.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) problem = "Please enter a valid email address.";
    else if (msg.length < 10) problem = "Your message should be at least 10 characters.";
    err.hidden = !problem; err.textContent = problem; ok.hidden = true;
    if (problem) return;
    // To receive real messages, point this form to a service like Formspree.
    ok.hidden = false; e.target.reset();
  });
}

/* ---------- Start ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-add]");
  if (b) { addToCart(Number(b.dataset.add), 1); toast("Added to cart"); }
});
document.addEventListener("DOMContentLoaded", () => {
  layout();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "product") initProduct();
  if (page === "cart") initCart();
  if (page === "contact") initContact();
});