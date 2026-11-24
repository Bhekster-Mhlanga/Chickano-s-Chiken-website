import categories from "../data/categories.json";
const CATS=categories;
const $=(i)=>document.getElementById(i);

export function initTicker(){
/* ticker: two identical lists make a seamless loop */
var li=CATS.map(function(c){return "<li>"+c+"</li>"}).join("");
$("track").innerHTML="<ul>"+li+"</ul><ul aria-hidden=\"true\">"+li+"</ul>";
}
