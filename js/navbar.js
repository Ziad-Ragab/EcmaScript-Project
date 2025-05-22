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
  
  