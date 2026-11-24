import branches from "../data/branches.json";
const BR = branches.map((b) => ({ n: b.name, wa: b.whatsapp }));
// Delivery fee per branch comes from branches.json (null = "confirmed by the branch")
const DELIVERY_FEE = Object.fromEntries(branches.filter((b) => b.deliveryFee != null).map((b) => [b.name, b.deliveryFee]));
const HOURS = { open: 8, close: 20 }; // delivery hours, South Africa time
const $=(i)=>document.getElementById(i);

export function initCart(){
/* cart */
var KEY="chickanos-cart-v1",S={items:[],branch:"Lydenburg",mode:"Delivery",name:"",phone:"",addr:"",notes:""};
try{var sv=JSON.parse(localStorage.getItem(KEY)||"null");if(sv)for(var k in sv)S[k]=sv[k]}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function money(n){return "R"+n.toFixed(2)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]})}
function sub(){return S.items.reduce(function(a,i){return a+i.price*i.qty},0)}
function isOpen(){var h=+new Intl.DateTimeFormat("en-ZA",{timeZone:"Africa/Johannesburg",hour:"numeric",hour12:false}).format(new Date())%24;return h>=HOURS.open&&h<HOURS.close}
var branchEl=$("branch");branchEl.innerHTML=BR.map(function(b){return "<option>"+b.n+"</option>"}).join("");
function render(){
 var n=S.items.reduce(function(a,i){return a+i.qty},0),c=$("count");c.textContent=n;c.hidden=!n;
 var box=$("items");
 if(!S.items.length){box.innerHTML="<div class=\"empty\"><p>Your cart is empty.<br>Add items from the menu to start an order.</p><button class=\"ghost\" id=\"demo\">Add a sample item (demo)</button></div>";$("demo").onclick=function(){add({id:"demo",name:"1/4 Chicken &amp; Chips (sample)".replace("&amp;","&"),price:49.9})}}
 else box.innerHTML=S.items.map(function(i,x){return "<div class=\"line\"><b>"+esc(i.name)+"</b><span class=\"p\">"+money(i.price*i.qty)+"</span>"+(i.note?"<small>"+esc(i.note)+"</small>":"")+"<div class=\"qty\"><button data-d=\"-1\" data-x=\""+x+"\" aria-label=\"Fewer\">−</button><span>"+i.qty+"</span><button data-d=\"1\" data-x=\""+x+"\" aria-label=\"More\">+</button></div><button class=\"rm\" data-r=\""+x+"\">Remove</button></div>"}).join("");
 $("form").style.display=S.items.length?"block":"none";
 branchEl.value=S.branch;
 var del=S.mode==="Delivery";document.querySelector("input[name=mode][value="+S.mode+"]").checked=true;
 $("addrW").style.display=del?"block":"none";
 var f=DELIVERY_FEE[S.branch],t=sub();
 $("fee").textContent=del?(f!=null?"Delivery fee: "+money(f)+" (included in total)":"Delivery fee confirmed by the branch on WhatsApp."):"Pickup: no delivery fee.";
 $("total").textContent=money(t+(del&&f?f:0));
 $("closed").hidden=isOpen();
 $("send").disabled=!S.items.length;
 $("cname").value=S.name;$("cphone").value=S.phone;$("addr").value=S.addr;$("notes").value=S.notes;
 save();
}
function add(it,o){var f=S.items.filter(function(x){return x.id===it.id&&x.note===(it.note||"")})[0];if(f)f.qty+=it.qty||1;else S.items.push({id:it.id,name:it.name,price:it.price,qty:it.qty||1,note:it.note||""});render();if(!(o&&o.silent))openC()}
window.Cart={add:add,open:openC};
var last;function openC(){last=document.activeElement;document.documentElement.classList.add("open");document.body.style.overflow="hidden";setTimeout(function(){$("closeCart").focus()},50)}
function closeC(){document.documentElement.classList.remove("open");document.body.style.overflow="";if(last)last.focus()}
$("openCart").onclick=openC;$("closeCart").onclick=closeC;$("shade").onclick=closeC;
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeC()});
$("items").onclick=function(e){var t=e.target;if(t.dataset.d){var i=S.items[+t.dataset.x];i.qty+=+t.dataset.d;if(i.qty<1)S.items.splice(+t.dataset.x,1);render()}else if(t.dataset.r){S.items.splice(+t.dataset.r,1);render()}};
branchEl.onchange=function(){S.branch=this.value;render()};
Array.prototype.forEach.call(document.querySelectorAll("input[name=mode]"),function(r){r.onchange=function(){S.mode=this.value;render()}});
[["cname","name"],["cphone","phone"],["addr","addr"],["notes","notes"]].forEach(function(p){$(p[0]).oninput=function(){S[p[1]]=this.value;save()}});
$("send").onclick=function(){
 var e=$("err");e.textContent="";
 if(!S.name.trim()){e.textContent="Enter your name.";$("cname").focus();return}
 if(!/[0-9]{9,}/.test(S.phone.replace(/\D/g,""))){e.textContent="Enter a valid phone number.";$("cphone").focus();return}
 if(S.mode==="Delivery"&&!S.addr.trim()){e.textContent="Enter your delivery address, or choose Pickup.";$("addr").focus();return}
 var b=BR.filter(function(x){return x.n===S.branch})[0],f=DELIVERY_FEE[S.branch],del=S.mode==="Delivery";
 var L=["*New order for Chickano’s "+b.n+"*","","Name: "+S.name.trim(),"Phone: "+S.phone.trim(),"Order type: "+S.mode];
 if(del)L.push("Address: "+S.addr.trim());
 L.push("","*Items*");
 S.items.forEach(function(i){L.push(i.qty+" x "+i.name+(i.note?" ("+i.note+")":"")+" = "+money(i.price*i.qty))});
 L.push("","Estimated total: "+money(sub()+(del&&f?f:0)));
 if(del&&f==null)L.push("Delivery fee: please confirm");
 if(S.notes.trim())L.push("Notes: "+S.notes.trim());
 window.open("https://wa.me/"+b.wa+"?text="+encodeURIComponent(L.join("\n")),"_blank","noopener");
};
render();
}
