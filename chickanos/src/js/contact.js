import branches from "../data/branches.json";
import site from "../data/site.json";

const $ = (i) => document.getElementById(i);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const digits = (s) => s.replace(/\s/g, "");

export function initContact() {
  const form = $("cform");
  if (!form) return;

  $("cinfo").innerHTML = [
    ["Email", `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`],
    ["Head office", `<a href="tel:${digits(site.headOfficePhone)}">${esc(site.headOfficePhone)}</a>`],
    ["Facebook", `<a href="${esc(site.facebook)}" target="_blank" rel="noopener">Chickano’s Chicken</a>`],
  ]
    .map(([t, v]) => `<div class="t-card"><h3>${t}</h3><p>${v}</p></div>`)
    .join("");

  $("tiles").innerHTML = branches
    .map(
      (b) => `<article class="t-card"><h3>${esc(b.name)}</h3>
<p>${b.landline ? esc(b.landline) + " · " : ""}${esc(b.tel)}</p>
<div class="b-btns"><a class="b-b" href="tel:${digits(b.landline || b.tel)}">Call</a><a class="b-b" href="https://wa.me/${b.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></div>
<p class="t-l"><a href="/find-a-chickano.html">Address and hours</a></p></article>`
    )
    .join("");

  $("cBranch").innerHTML = branches.map((b) => `<option>${esc(b.name)}</option>`).join("");

  const radios = form.querySelectorAll("input[name=ctype]");
  const type = () => form.querySelector("input[name=ctype]:checked").value;
  const sync = () => ($("cOrderW").hidden = type() === "Enquiry");
  radios.forEach((r) => (r.onchange = sync));

  // /contact.html#feedback or #complaint opens on "Complaint"; #compliment on "Compliment"
  const h = location.hash.slice(1);
  const pre = { feedback: "Complaint", complaint: "Complaint", compliment: "Compliment" }[h];
  if (pre) form.querySelector(`input[value=${pre}]`).checked = true;
  sync();

  function build() {
    const v = (id) => $(id).value.trim();
    const err = $("cErr");
    err.textContent = "";
    if (!v("cName")) return (err.textContent = "Please enter your name."), $("cName").focus(), null;
    if (!v("cPhone") && !v("cEmail")) return (err.textContent = "Please add a phone number or email so we can reply."), $("cPhone").focus(), null;
    if (v("cEmail") && !/^\S+@\S+\.\S+$/.test(v("cEmail"))) return (err.textContent = "That email address doesn’t look right."), $("cEmail").focus(), null;
    if (!v("cMsg")) return (err.textContent = "Please write your message."), $("cMsg").focus(), null;
    const t = type(),
      branch = v("cBranch");
    const lines = [`${t} for Chickano’s ${branch}`, "", `Name: ${v("cName")}`];
    if (v("cPhone")) lines.push(`Phone: ${v("cPhone")}`);
    if (v("cEmail")) lines.push(`Email: ${v("cEmail")}`);
    if (t !== "Enquiry" && v("cOrder")) lines.push(`Order: ${v("cOrder")}`);
    lines.push("", v("cMsg"));
    return { text: lines.join("\n"), subject: `${t} – Chickano’s ${branch}`, branch };
  }

  $("sendWa").onclick = () => {
    const m = build();
    if (!m) return;
    const b = branches.find((x) => x.name === m.branch);
    window.open("https://wa.me/" + b.whatsapp + "?text=" + encodeURIComponent(m.text), "_blank", "noopener");
  };
  $("sendMail").onclick = () => {
    const m = build();
    if (!m) return;
    location.href = `mailto:${site.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.text)}`;
  };
  form.onsubmit = (e) => e.preventDefault();
}
