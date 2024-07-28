!function(){"use strict";const e="https://x8ki-letl-twmt.n7.xano.io/api:ZvUi_3ML/users",t=["email","first_name","last_name","company"];let r="email",o=null;const n=(...e)=>console.log("[ProgressiveFlow]",...e),a=(e,t)=>{s(e);const r=document.createElement("div");r.className="error-message",r.textContent=t,e.parentNode.appendChild(r),e.classList.add("error")},s=e=>{e.parentNode.querySelector(".error-message")?.remove(),e.classList.remove("error")},i=e=>{const t=document.querySelector(`[pf\\:step="${e}"]`);t&&(t.style.display="block",t.querySelector(`[pf\\:${e}]`)?.focus())},c=()=>{try{(()=>{const e=document.createElement("style");e.textContent="\n    .error { border-color: red; }\n    [pf\\:step] { display: none; }\n    .error-message { color: red; font-size: 12px; margin-top: 5px; }\n  ",document.head.appendChild(e)})();const e=document.querySelector("[pf\\:form]");if(!e)throw new Error("No form with pf:form found");e.addEventListener("click",l),e.addEventListener("keydown",m),i("email"),n("ProgressiveFlow form initialized")}catch(e){console.error("Error initializing form:",e)}},l=e=>{const t=e.target;t.matches("[pf\\:next]")?(e.preventDefault(),d()):t.matches("[pf\\:submit]")&&(e.preventDefault(),y())},m=e=>{"Enter"===e.key&&(e.preventDefault(),"email"===r?d():y())},d=async()=>{if(f(r)){if(p(r),"email"===r)try{if(o=await(async t=>{try{const r=await fetch(`${e}/${encodeURIComponent(t)}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(404===r.status)return{email:t,first_name:"",last_name:"",company:""};if(!r.ok){const e=await r.json();throw new Error(e.message||"Failed to fetch user data")}return r.json()}catch(e){throw console.error("Error in fetchUserData:",e),e}})(o.email),n("User data fetched:",o),s=o,t.every((e=>""!==s?.[e]?.trim())))return void await y()}catch(e){return console.error("Error fetching user data:",e),void a(document.querySelector(`[pf\\:${r}]`),e.message)}const c=u();c?((e=>{const t=document.querySelector(`[pf\\:step="${e}"]`);t&&(t.style.display="none")})(r),i(c),r=c):await y()}var s},u=()=>{const e=t.indexOf(r);return t.slice(e+1).find((e=>!o?.[e]?.trim()))},f=e=>{const t=document.querySelector(`[pf\\:${e}]`);return t?.value.trim()?(s(t),"email"!==e||(r=t.value,/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(r).toLowerCase()))):(a(t,"This field is required."),!1);var r},p=e=>{o||(o={});const t=document.querySelector(`[pf\\:${e}]`);t&&(o[e]=t.value)},y=async()=>{try{if(!o?.email)throw new Error("User data is not properly initialized");p(r),n("Submitting form with user data:",o),await(async t=>{const r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok){const e=await r.json();throw new Error(e.message||"Failed to submit form to API")}return r.json()})(o),n("Form submitted successfully to API"),Object.entries(o).forEach((([e,t])=>{const r=document.querySelector(`[pf\\:${e}]`);r&&(r.value=t)}));const t=document.querySelector("[pf\\:form]"),a=new Event("submit",{bubbles:!0,cancelable:!0});t.dispatchEvent(a)}catch(e){console.error("Error submitting form:",e),a(document.querySelector(`[pf\\:${r}]`),e.message||"Failed to submit form. Please try again.")}};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",c):c()}();