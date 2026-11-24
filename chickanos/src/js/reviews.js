import reviews from "../data/reviews.json";
const REVIEWS=reviews.map((r)=>[r.text,r.name]);
const $=(i)=>document.getElementById(i);

export function initReviews(){
if(!$("dots"))return;
/* reviews */
var ri=0,dots=$("dots");
dots.innerHTML=REVIEWS.map(function(_,i){return "<button aria-label=\"Review "+(i+1)+"\" data-i=\""+i+"\"></button>"}).join("");
function showR(){var r=REVIEWS[ri];var s=$("stage");s.innerHTML="";var b=document.createElement("blockquote");b.textContent="“"+r[0]+"”";var c=document.createElement("cite");c.textContent=r[1];b.appendChild(c);s.appendChild(b);
 Array.prototype.forEach.call(dots.children,function(d,i){d.setAttribute("aria-current",i===ri)})}
$("prev").onclick=function(){ri=(ri+REVIEWS.length-1)%REVIEWS.length;showR()};
$("next").onclick=function(){ri=(ri+1)%REVIEWS.length;showR()};
dots.onclick=function(e){if(e.target.dataset.i){ri=+e.target.dataset.i;showR()}};
showR();
}
