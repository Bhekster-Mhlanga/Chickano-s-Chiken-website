import menu from "../data/menu.json";
import featured from "../data/featured.json";
import { addToCart, openOptions } from "./order.js";

const money = (n) => "R" + n.toFixed(2);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byId = Object.fromEntries(menu.items.map((i) => [i.id, i]));
const icons = Object.fromEntries(menu.categories.map((c) => [c.id, c.icon]));

// Second hero belt: featured menu items (ids in src/data/featured.json) moving right.
export function initShopBelt() {
  const track = document.getElementById("shopTrack");
  if (!track) return;

  const card = (i) => {
    const price = (i.options ? "From " : "") + money(i.price);
    return `<li class="pc">
 <a class="pc-link" href="/menu.html#item-${i.id}" aria-label="${esc(i.name)}, ${price}. View details">
  <div class="pc-ph">${i.image ? `<img src="${esc(i.image)}" alt="" loading="lazy">` : `<span aria-hidden="true">${icons[i.cat] || "🍗"}</span>`}</div>
  <div class="pc-b"><span class="pc-n">${esc(i.name)}</span><span class="pc-p">${price}</span></div>
 </a>
 <button class="pc-add" data-id="${i.id}" aria-label="${i.options ? "Choose options for" : "Add"} ${esc(i.name)}${i.options ? "" : " to order"}">+</button>
</li>`;
  };

  const row = featured.map((id) => byId[id]).filter(Boolean).map(card).join("");
  // two identical rows make a seamless loop; the copy is hidden from keyboard and screen readers
  track.innerHTML = `<ul>${row}</ul><ul aria-hidden="true" inert>${row}</ul>`;

  track.onclick = (e) => {
    const b = e.target.closest(".pc-add");
    if (!b) return;
    const item = byId[b.dataset.id];
    item.options ? openOptions(item) : addToCart(item, 1, []);
  };
}
