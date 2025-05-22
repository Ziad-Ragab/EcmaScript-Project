function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
    
    // إغلاق القائمة عند النقر على رابط
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
}



////////////////////////////////////////////////////////
// dark-light
const body=document.querySelector("body");
const nav=document.querySelector("nav");
const mode=document.querySelector(".dark-light");

mode.addEventListener("click",()=>{
    mode.classList.toggle("active");
    body.classList.toggle("dark")
})

