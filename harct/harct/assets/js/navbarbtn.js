const navbarbtn = document.getElementById("navbarbtn");
const aside = document.getElementById("aside");
navbarbtn.addEventListener("click", ()=>{
    aside.classList.toggle("nav-aside-close");
})