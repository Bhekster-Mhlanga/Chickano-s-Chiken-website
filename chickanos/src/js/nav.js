const $=(i)=>document.getElementById(i);

export function initNav(){
var cur=location.pathname.replace(/index\.html$/,"").replace(/\/$/,"")||"/";
document.querySelectorAll("#links a").forEach(function(a){var p=new URL(a.href,location.href).pathname.replace(/\/$/,"")||"/";if(p===cur)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
/* nav */
var nav=$("nav"),bg=$("burger");
bg.onclick=function(){var o=nav.classList.toggle("menu");bg.setAttribute("aria-expanded",o)};
$("links").onclick=function(e){if(e.target.tagName==="A"){nav.classList.remove("menu");bg.setAttribute("aria-expanded","false")}};
}
