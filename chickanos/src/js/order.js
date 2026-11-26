const $ = (i) => document.getElementById(i);
const money = (n) => "R" + n.toFixed(2);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Shared "add to order" flow used by the Menu page and the Home page belt.
export function addToCart(item, qty, picked) {
  const price = item.price + picked.reduce((a, c) => a + c.delta, 0);
  const note = picked.filter((c) => !c.none).map((c) => c.name).join(", ");
  const id = item.id + "|" + picked.map((c) => c.name).join(",");
  window.Cart.add({ id, name: item.name, price, qty, note }, { silent: true });
  const t = $("toast");
  t.textContent = "Added to order: " + item.name;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 1800);
}

export function openOptions(item) {
  const d = $("opt");
  let qty = 1;
  d.innerHTML =
    `<div class="o-h"><h2 id="optT">${esc(item.name)}</h2><button class="x" data-close aria-label="Close">×</button></div>` +
    (item.desc ? `<p class="o-d">${esc(item.desc)}</p>` : "") +
    item.options
      .map(
        (g, gi) =>
          `<fieldset class="o-g"><legend>${esc(g.label)}</legend>` +
          g.choices
            .map(
              (c, ci) =>
                `<label class="o-c"><input type="radio" name="g${gi}" value="${ci}"${ci === 0 ? " checked" : ""}><span>${esc(c.name)}</span><em>${c.delta ? "+" + money(c.delta) : ""}</em></label>`
            )
            .join("") +
          `</fieldset>`
      )
      .join("") +
    `<div class="o-f"><div class="qty"><button data-q="-1" aria-label="Fewer">−</button><span id="oq">1</span><button data-q="1" aria-label="More">+</button></div><button class="o-add" id="oadd"></button></div>`;

  const picked = () =>
    item.options.map((g, gi) => g.choices[+d.querySelector(`input[name=g${gi}]:checked`).value]);
  const total = () => (item.price + picked().reduce((a, c) => a + c.delta, 0)) * qty;
  const upd = () => {
    $("oq").textContent = qty;
    $("oadd").textContent = "Add to order · " + money(total());
  };
  d.onchange = upd;
  d.onclick = (e) => {
    const t = e.target;
    if (t === d || t.hasAttribute("data-close")) return d.close();
    if (t.dataset.q) {
      qty = Math.max(1, qty + +t.dataset.q);
      upd();
    } else if (t.id === "oadd") {
      addToCart(item, qty, picked());
      d.close();
    }
  };
  upd();
  d.showModal();
}
