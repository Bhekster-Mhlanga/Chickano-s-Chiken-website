import branches from "../data/branches.json";
import site from "../data/site.json";

const $ = (i) => document.getElementById(i);

export function initFranchising() {
  const form = $("fform");
  if (!form) return;

  $("fCount").textContent = branches.length;
  if (site.franchiseImage) {
    $("fImgEl").src = site.franchiseImage;
    $("fImg").hidden = false;
  }

  const type = () => form.querySelector("input[name=ftype]:checked").value;
  const sync = () => ($("fSiteW").hidden = type() !== "Site submission");
  form.querySelectorAll("input[name=ftype]").forEach((r) => (r.onchange = sync));

  const pick = (t) => {
    form.querySelector(`input[value="${t}"]`).checked = true;
    sync();
  };
  const hash = { apply: "Franchise application", site: "Site submission", profile: "Company profile request" }[location.hash.slice(1)];
  if (hash) pick(hash);
  sync();

  document.querySelectorAll("[data-pick]").forEach((b) => {
    b.onclick = () => {
      pick(b.dataset.pick);
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => $("fName").focus({ preventScroll: true }), 400);
    };
  });

  function build() {
    const v = (id) => $(id).value.trim();
    const err = $("fErr");
    err.textContent = "";
    const t = type();
    if (!v("fName")) return (err.textContent = "Please enter your name."), $("fName").focus(), null;
    if (!v("fPhone") && !v("fEmail")) return (err.textContent = "Please add a phone number or email so we can reply."), $("fPhone").focus(), null;
    if (v("fEmail") && !/^\S+@\S+\.\S+$/.test(v("fEmail"))) return (err.textContent = "That email address doesn’t look right."), $("fEmail").focus(), null;
    if (t === "Site submission" && !v("fSite")) return (err.textContent = "Please add the site address and details."), $("fSite").focus(), null;
    const lines = [`Franchise enquiry: ${t}`, "", `Name: ${v("fName")}`];
    if (v("fPhone")) lines.push(`Phone: ${v("fPhone")}`);
    if (v("fEmail")) lines.push(`Email: ${v("fEmail")}`);
    if (v("fArea")) lines.push(`Town/area: ${v("fArea")}`);
    if (t === "Site submission") lines.push(`Site: ${v("fSite")}`);
    if (v("fMsg")) lines.push("", v("fMsg"));
    return { text: lines.join("\n"), subject: `Franchise – ${t}` };
  }

  $("fWa").onclick = () => {
    const m = build();
    if (m) window.open("https://wa.me/" + branches[0].whatsapp + "?text=" + encodeURIComponent(m.text), "_blank", "noopener");
  };
  $("fMail").onclick = () => {
    const m = build();
    if (m) location.href = `mailto:${site.email}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.text)}`;
  };
  form.onsubmit = (e) => e.preventDefault();
}
