// Hamburger menu toggle
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

////////////////////////////////////////////////////////

// كائن لتخزين الفهرس الحالي لكل Slider (slider1 و slider2)
const sliderIndices = {};

/**
 * الدالة showSlide:
 * تعرض الشريحة المطلوبة باستخدام transform وتحدث نقاط التنقل (إن وجدت).
 */
function showSlide(sliderId, index) {
  const slider = document.getElementById(sliderId);
  const slides = slider.querySelectorAll('.slide');
  
  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;
  
  slider.querySelector('.slides').style.transform = 'translateX(' + (-index * 100) + '%)';
  sliderIndices[sliderId] = index;
  
  // تحديث نقاط التنقل إذا كانت موجودة
  const dots = slider.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

/**
 * دالة changeSlide:
 * تُحدث الفهرس الحالي بمقدار n (يمثل الانتقال للشرائح التالية أو السابقة)
 */
function changeSlide(sliderId, n) {
  let index = sliderIndices[sliderId] || 0;
  index += n;
  showSlide(sliderId, index);
}

/**
 * دالة currentSlide:
 * لضبط الشريحة مباشرةً عند النقر على نقطة التنقل
 */
function currentSlide(sliderId, n) {
  showSlide(sliderId, n);
}

// عند تحميل الوثيقة
document.addEventListener("DOMContentLoaded", () => {
  // تهيئة كلا الـ sliders على البداية
  showSlide('slider1', 0);
  showSlide('slider2', 0);

  // تشغيل تلقائي للـ Slider الأول:
  setInterval(() => {
    changeSlide('slider1', 1);
  }, 5000); // تغيير الشريحة كل 5 ثوانٍ (يمكنك تعديل القيمة)

  // تشغيل تلقائي للـ Slider الثاني:
  setInterval(() => {
    changeSlide('slider2', 1);
  }, 5000);
});

////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  // تحميل المنتجات من ملف JSON
  fetch("../data/products.json")
      .then(response => response.json())
      .then(data => {
          const products = data.furniture.slice(0, 8); // أخذ أول 8 منتجات فقط
          const featuredContainer = document.querySelector('.featured-products');
          
          if (!featuredContainer) return;
          
          featuredContainer.innerHTML = '';
          
          products.forEach(product => {
              const productCard = document.createElement('div');
              productCard.classList.add('product-card');
              productCard.innerHTML = `
                  <div class="image-gallery">
                      <a href="./description.html?id=${product.id}"><img src="${product.images[0]}" alt="${product.title}" class="card-background"></a>
                      <div class="controls">
                          <span class="btn active"></span>
                          <span class="btn"></span>
                          <span class="btn"></span>
                      </div>
                  </div>
                  ${product.isNew ? '<div class="new">New</div>' : ''}
                  ${product.discount === '30%' ? '<div class="discount discount-30"><img src="/assets/images/icons/discount30.png" alt="Discount 30%"></div>' : ''}
                  ${product.discount === '50%' ? '<div class="discount discount-50"><img src="/assets/images/icons/discount50.png" alt="Discount 50%"></div>' : ''}
                  <div class="cart-info cart-wrap wish-container">
                      <a class="wish-button" title="Add To Wishlist"><i class="fas fa-heart" aria-hidden="true"></i></a>
                      <a class="view-button" title="Quick View"><i class="fa fa-eye" aria-hidden="true"></i></a>
                  </div>
                  <div class="product-info">
                      <h3>${product.title}</h3>
                      <p>${product.description || 'No description available'}</p>
                      <p class="price"> ${product.price.toFixed(2)} EGP</p>
                      <div class="product-rating">
                          <span class="stars">${renderStars(product.rate)}</span>
                          <span class="rate-value">(${product.rate})</span>
                      </div>
                  </div>
              `;
              featuredContainer.appendChild(productCard);
          });

          // إضافة الأحداث للعناصر الديناميكية
          addProductEvents();
      })
      .catch(error => console.error('Error loading products:', error));
});

// دالة لتحويل التقييم إلى نجوم (يجب أن تكون متاحة بشكل عام)
function renderStars(rate) {
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="fa fa-star" aria-hidden="true"></i>';
  }
  if (hasHalfStar) {
      starsHTML += '<i class="fa fa-star-half-o" aria-hidden="true"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="fa fa-star-o" aria-hidden="true"></i>';
  }

  return starsHTML;
}

// دالة لإضافة الأحداث للعناصر الديناميكية
function addProductEvents() {
  // أحداث أزرار الرغبات
  document.querySelectorAll('.wish-button').forEach(button => {
      button.addEventListener('click', function(event) {
          event.stopPropagation();
          this.classList.toggle('active');
          const icon = this.querySelector('i');
          icon.classList.toggle('fas');
          icon.classList.toggle('far');
          const productCard = this.closest('.product-card');
          const productName = productCard.querySelector('.product-info h3').textContent;
          console.log(`${productName} ${this.classList.contains('active') ? 'added to' : 'removed from'} wishlist!`);
      });
  });

  // أحداث تغيير الصور
  document.querySelectorAll('.product-card').forEach(card => {
      const imageElement = card.querySelector('.card-background');
      const controlButtons = card.querySelectorAll('.controls .btn');
      
      controlButtons.forEach((btn, btnIndex) => {
          btn.addEventListener('click', function() {
              const productName = card.querySelector('.product-info h3').textContent;
              // هنا يجب عليك الوصول إلى مصفوفة الصور للمنتج
              // يمكنك تخزينها في dataset أو البحث عنها
              const productImages = JSON.parse(card.dataset.images || '[]');
              if (productImages[btnIndex]) {
                  imageElement.src = productImages[btnIndex];
                  controlButtons.forEach(b => b.classList.remove('active'));
                  this.classList.add('active');
              }
          });
      });
  });
}

// تأكد من وجود دالة addToCart بشكل عام
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) {
      console.error('Product not found!');
      return;
  }
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductIndex = cart.findIndex(item => item.id === productId);
  
  if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
  } else {
      cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          quantity: 1
      });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast(`${product.title} added to cart!`);
  updateCartCounter();
}
