

// المتغيرات العامة
let allProducts = [];
let displayedProducts = [];

// دالة لعرض إشعار منبثق (Toast Notification)
function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

///////////////////////////////////
// dark-light
const body=document.querySelector("body");
const nav=document.querySelector("nav");
const mode=document.querySelector(".dark-light");

mode.addEventListener("click",()=>{
    mode.classList.toggle("active");
    body.classList.toggle("dark")
})

// دالة لتحديث عداد سلة التسوق
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// دالة لإضافة المنتج إلى سلة التسوق
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

// دالة لتحويل التقييم إلى نجوم
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

// دالة لعرض المنتجات في الـ Grid
function displayProducts(products, limit = 16) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    const productsToShow = products.slice(0, limit);

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
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
            <a class="btn btn-solid pulse-animation add-to-cart" style="width: 100%;" onclick="addToCart(${product.id})">Add to cart</a>
        `;
        productGrid.appendChild(card);
    });

    // إضافة أحداث لأزرار المنتجات
    const newWishButtons = document.querySelectorAll('.wish-button');
    const newViewButtons = document.querySelectorAll('.view-button');
    const productCards = document.querySelectorAll('.product-card');

    // أحداث أزرار Wishlist
    newWishButtons.forEach(button => {
        button.addEventListener('click', function (event) {
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

    // أحداث أزرار Quick View
    const modal = document.getElementById('quickViewModal');
    const modalImage = document.getElementById('modalImage');
    const modalButtons = modal.querySelectorAll('.controls .btn');

    newViewButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            event.preventDefault();
            console.log('Quick View button clicked!');

            const productCard = this.closest('.product-card');
            if (!productCard) {
                console.error('Product card not found!');
                return;
            }

            const productName = productCard.querySelector('.product-info h3').textContent;
            const productDescription = productCard.querySelector('.product-info p').textContent;
            const productPrice = productCard.querySelector('.product-info .price').textContent;
            const product = allProducts.find(p => p.title === productName);

            if (!product) {
                console.error(`Product with title ${productName} not found!`);
                return;
            }

            const productRate = product.rate;
            const productImages = product.images;

            document.getElementById('modalName').textContent = productName;
            document.getElementById('modalDescription').textContent = productDescription;
            document.getElementById('modalPrice').textContent = productPrice;
            modalImage.src = productImages[0];

            // إضافة التقييم في الـ Modal
            const modalDetails = modal.querySelector('.product-details');
            if (!modalDetails) {
                console.error('Product details not found!');
                return;
            }

            const existingRating = modalDetails.querySelector('.product-rating');
            if (existingRating) existingRating.remove();
            const ratingDiv = document.createElement('div');
            ratingDiv.classList.add('product-rating');
            ratingDiv.innerHTML = `
                <span class="stars">${renderStars(productRate)}</span>
                <span class="rate-value">(${productRate})</span>
            `;
            modalDetails.appendChild(ratingDiv);

            modal.style.display = 'flex';

            modalButtons.forEach((btn, btnIndex) => {
                btn.classList.remove('active');
                if (btnIndex === 0) btn.classList.add('active');
                btn.addEventListener('click', function () {
                    modalImage.src = productImages[btnIndex];
                    modalButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        });
    });

    // أحداث أزرار التحكم في الصور
    productCards.forEach(card => {
        const productName = card.querySelector('.product-info h3').textContent;
        const product = allProducts.find(p => p.title === productName);
        const imageElement = card.querySelector('.card-background');
        const controlButtons = card.querySelectorAll('.controls .btn');

        controlButtons.forEach((btn, btnIndex) => {
            btn.addEventListener('click', function () {
                imageElement.src = product.images[btnIndex];
                controlButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // نختار العناصر الأساسية
    const showSelect = document.querySelector('.show-select');
    const sortSelect = document.querySelector('.sort-select');
    const searchInput = document.getElementById('searchInput');
    const resultsCount = document.querySelector('.results-count');
    const modal = document.getElementById('quickViewModal');
    const closeModal = document.querySelector('.close-modal');
    const modalAddToCart = modal.querySelector('.sub-btn .btn');

    // تحديث عداد سلة التسوق عند تحميل الصفحة
    updateCartCounter();

    // تحميل المنتجات من ملف JSON
    fetch("../data/products.json")
        .then(response => response.json())
        .then(data => {
            allProducts = data.furniture;
            displayedProducts = [...allProducts];
            displayProducts(displayedProducts);
        })
        .catch(error => console.error('Error loading products:', error));

    // وظيفة "Show"
    if (showSelect) {
        showSelect.addEventListener('change', function () {
            const limit = parseInt(this.value);
            displayProducts(displayedProducts, limit);
        });
    }

    // وظيفة "Sort by"
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            const sortOption = this.value;
            let sortedProducts = [...allProducts];

            if (sortOption === 'price-low') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (sortOption === 'price-high') {
                sortedProducts.sort((a, b) => b.price - a.price);
            } else {
                sortedProducts = [...allProducts];
            }

            displayedProducts = sortedProducts;
            displayProducts(displayedProducts, parseInt(showSelect.value));
        });
    }

    // وظيفة البحث
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = allProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm)
            );

            displayedProducts = filteredProducts;
            displayProducts(displayedProducts, parseInt(showSelect.value));
        });
    }

    // وظيفة زر Add to Cart في الـ Modal
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function () {
            const productName = document.getElementById('modalName').textContent;
            const product = allProducts.find(p => p.title === productName);
            
            if (product) {
                addToCart(product.id);
                modal.style.display = 'none';
            }
        });
    }

    // إغلاق الـ Modal
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// دالة toggleMenu للقائمة (إن وجدت)
function toggleMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    });
}