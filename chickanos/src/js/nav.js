const $=(i)=>document.getElementById(i);

export function initNav(){
/* nav */
var nav=$("nav"),bg=$("burger");
bg.onclick=function(){var o=nav.classList.toggle("menu");bg.setAttribute("aria-expanded",o)};
$("links").onclick=function(e){if(e.target.tagName==="A"){nav.classList.remove("menu");bg.setAttribute("aria-expanded","false")}};
}
