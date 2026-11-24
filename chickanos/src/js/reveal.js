const $=(i)=>document.getElementById(i);

export function initReveal(){
/* slide-in reveals */
var els=document.querySelectorAll(".rv-l,.rv-r,.rv-d");
if("IntersectionObserver" in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e,i){if(e.isIntersecting){var t=e.target;setTimeout(function(){t.classList.add("in")},i*120);io.unobserve(t)}})},{threshold:.25});
 els.forEach(function(el,i){el.style.transitionDelay=(i*.12)+"s";io.observe(el)});
}else els.forEach(function(el){el.classList.add("in")});
}
