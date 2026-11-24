import branches from "../data/branches.json";

const $ = (i) => document.getElementById(i);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const digits = (s) => s.replace(/\s/g, "");

// Regular shop hours (South Africa time). Public holidays are not detected.
function status() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-ZA", { timeZone: "Africa/Johannesburg", weekday: "short", hour: "numeric", minute: "numeric", hour12: false })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value])
  );
  const mins = (+p.hour % 24) * 60 + +p.minute;
  const sunday = p.weekday === "Sun";
  const open = (sunday ? 9 : 8) * 60;
  if (mins >= open && mins < 20 * 60) return { open: true, text: "Open now · closes 8pm" };
  const next = mins < open ? open : ((p.weekday === "Sat" ? 9 : 8) * 60);
  return { open: false, text: "Closed · opens " + (next / 60) + "am" };
}

export function initFind() {
  const list = $("branchList");
  if (!list) return;
  const map = $("map");

  list.innerHTML = branches
    .map((b, i) => {
      const call = b.landline || b.tel;
      return `<article class="b-card" data-i="${i}">
 <div class="b-top"><h2>${esc(b.name)}${i === 0 ? " <small>Head office</small>" : ""}</h2><span class="b-st" data-st></span></div>
 <p class="b-a">${esc(b.address)}</p>
 <ul class="b-h"><li>Mon to Sat: 8am to 8pm</li><li>Sundays &amp; public holidays: 9am to 8pm</li><li>Delivery: every day, 8am to 8pm</li></ul>
 <p class="b-p">${b.landline ? "Phone " + esc(b.landline) + " · " : ""}WhatsApp ${esc(b.tel)}</p>
 <div class="b-btns">
  <a class="b-b" href="tel:${digits(call)}">Call</a>
  <a class="b-b" href="https://wa.me/${b.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
  <a class="b-b" href="${esc(b.directions)}" target="_blank" rel="noopener">Directions</a>
  <button class="b-b ord" data-order="${esc(b.name)}">Order from here</button>
 </div></article>`;
    })
    .join("");

  function show(i) {
    map.src = "https://www.google.com/maps?q=" + encodeURIComponent(branches[i].mapQuery) + "&z=16&output=embed";
    map.title = "Map of Chickano’s " + branches[i].name;
    list.querySelectorAll(".b-card").forEach((c, j) => c.classList.toggle("on", j === i));
  }
  function stamp() {
    const s = status();
    list.querySelectorAll("[data-st]").forEach((el) => {
      el.textContent = s.text;
      el.classList.toggle("open", s.open);
    });
  }

  list.onclick = (e) => {
    const card = e.target.closest(".b-card");
    if (!card) return;
    const ord = e.target.closest("[data-order]");
    if (ord) {
      window.Cart.setBranch(ord.dataset.order);
      location.href = "/menu.html";
      return;
    }
    if (!e.target.closest("a")) show(+card.dataset.i);
  };

  stamp();
  setInterval(stamp, 60000);
  show(0);
}
