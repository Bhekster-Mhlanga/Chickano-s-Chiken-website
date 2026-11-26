import menu from "../data/menu.json";
import { addToCart, openOptions } from "./order.js";

const $ = (i) => document.getElementById(i);
const money = (n) => "R" + n.toFixed(2);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byId = Object.fromEntries(menu.items.map((i) => [i.id, i]));
const icons = Object.fromEntries(menu.categories.map((c) => [c.id, c.icon]));

export function initMenu() {
  const grid = $("menuGrid");
  if (!grid) return;
  let cat = location.hash.slice(1),
    q = "";
  const target = cat.startsWith("item-") ? cat.slice(5) : null; // /menu.html#item-<id> from the Home belt
  if (!menu.categories.some((c) => c.id === cat)) cat = "all";

  const chips = $("chips");
  chips.innerHTML = [{ id: "all", name: "All" }, ...menu.categories]
    .map((c) => `<button class="chip" data-c="${c.id}" aria-pressed="false">${esc(c.name)}</button>`)
    .join("");

  const card = (i) =>
    `<article class="card" id="i-${i.id}"><div class="ph">${
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
  if (target) {
    const el = document.getElementById("i-" + target);
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 3000);
    }
  }
}
