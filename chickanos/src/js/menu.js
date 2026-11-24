import menu from "../data/menu.json";

const $ = (i) => document.getElementById(i);
const money = (n) => "R" + n.toFixed(2);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byId = Object.fromEntries(menu.items.map((i) => [i.id, i]));
const icons = Object.fromEntries(menu.categories.map((c) => [c.id, c.icon]));

function addToCart(item, qty, picked) {
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

function openOptions(item) {
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

export function initMenu() {
  const grid = $("menuGrid");
  if (!grid) return;
  let cat = location.hash.slice(1),
    q = "";
  if (!menu.categories.some((c) => c.id === cat)) cat = "all";

  const chips = $("chips");
  chips.innerHTML = [{ id: "all", name: "All" }, ...menu.categories]
    .map((c) => `<button class="chip" data-c="${c.id}" aria-pressed="false">${esc(c.name)}</button>`)
    .join("");

  const card = (i) =>
    `<article class="card"><div class="ph">${
      i.image ? `<img src="${esc(i.image)}" alt="" loading="lazy">` : `<span aria-hidden="true">${icons[i.cat] || "🍗"}</span>`
    }</div><div class="cb"><h3>${esc(i.name)}</h3>${i.desc ? `<p class="d">${esc(i.desc)}</p>` : ""}<div class="cf"><span class="pr">${
      i.options ? "From " : ""
    }${money(i.price)}</span><button class="add" data-id="${i.id}" aria-label="${i.options ? "Choose options for" : "Add"} ${esc(i.name)}">${
      i.options ? "Choose" : "Add"
    }</button></div></div></article>`;

  function render() {
    chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.c === cat));
    const ql = q.trim().toLowerCase();
    const list = menu.items.filter(
      (i) => (cat === "all" || i.cat === cat) && (!ql || (i.name + " " + (i.desc || "")).toLowerCase().includes(ql))
    );
    if (!list.length) {
      grid.innerHTML = '<p class="m-empty">No items match your search. Try another word or category.</p>';
      return;
    }
    grid.innerHTML = menu.categories
      .map((c) => {
        const L = list.filter((i) => i.cat === c.id);
        return L.length ? `<h2 class="m-h" id="c-${c.id}">${esc(c.name)}</h2><div class="m-cards">${L.map(card).join("")}</div>` : "";
      })
      .join("");
  }

  chips.onclick = (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    cat = b.dataset.c;
    history.replaceState(null, "", cat === "all" ? location.pathname : "#" + cat);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  $("q").oninput = (e) => {
    q = e.target.value;
    render();
  };
  grid.onclick = (e) => {
    const b = e.target.closest(".add");
    if (!b) return;
    const item = byId[b.dataset.id];
    item.options ? openOptions(item) : addToCart(item, 1, []);
  };
  render();
}
