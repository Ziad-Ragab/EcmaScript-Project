// dark-light
const body=document.querySelector("body");
const nav=document.querySelector("nav");
const mode=document.querySelector(".dark-light");

mode.addEventListener("click",()=>{
    mode.classList.toggle("active");
    body.classList.toggle("dark")
})



document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    let currentProduct = null;
    let currentQuantity = 1;

    fetch("../data/products.json")
        .then(response => response.json())
        .then(data => {
            const description = document.getElementById("description");
            const product = data.furniture.find(item => item.id === productId);

            if (product) {
                currentProduct = product;
                const div = document.createElement("div");
                div.classList.add("item");

                div.innerHTML = `
                <div id="container">
                    <div id="img-container"><img src="${product.images[0]}" alt="${product.title}" ></div>
                    <div id="information">
                    <h1>${product.title}</h1>
                    <p ><strong>Price : </strong>${product.price.toFixed(2)} EGP </p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Rating:</strong> (${product.rate} )<span >★★★★★</span></p>
                     <strong>Sizes</strong>
                    <div id="sizes">
                     <p>M</p>
                    <p>L</p>
                    <p>XL</p>
                    </div>
                    <div id="color">
                      <div class="circle" style="background:#816DFA;"></div>
                      <div class="circle" style="background:#000000;"></div>
                      <div class="circle" style="background:#B88E2F;"></div>
                    </div>
                    
                    <div class="buttons">
                        <div id="btn">
                            <button onclick="decreaseQuantity(${product.id})" style="cursor: pointer;">-</button>
                            <span id="quantity-${product.id}">1</span>
                            <button onclick="increaseQuantity(${product.id})" style="cursor: pointer;">+</button>
                        </div>
                        <div>
                            <button class="cart-button" onclick="addToCart(${product.id})">
                                🛒 Add to Cart
                            </button>
                            <p id="message" class="message">Item added to cart!</p>
                        </div>
                    </div>
                    </div>
                </div>
                `;

                description.appendChild(div);
            } else {
                description.innerHTML = "<p>Product not found</p>";
            }
        });
});

// Global functions
function increaseQuantity(id) {
    const quantityElement = document.getElementById(`quantity-${id}`);
    const currentValue = parseInt(quantityElement.textContent);
    quantityElement.textContent = currentValue + 1;
}

function decreaseQuantity(id) {
    const quantityElement = document.getElementById(`quantity-${id}`);
    const currentValue = parseInt(quantityElement.textContent);
    if (currentValue > 1) {
        quantityElement.textContent = currentValue - 1;
    }
}

function addToCart(productId) {
    // Get current quantity
    const quantityElement = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityElement.textContent);
    
    // Get product details
    fetch("../data/products.json")
        .then(response => response.json())
        .then(data => {
            const product = data.furniture.find(item => item.id === productId);
            
            if (product) {
                // Get existing cart from localStorage or create new one
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Check if product already exists in cart
                const existingProductIndex = cart.findIndex(item => item.id === productId);
                
                if (existingProductIndex !== -1) {
                    // Update quantity if product exists
                    cart[existingProductIndex].quantity += quantity;
                } else {
                    // Add new product to cart
                    cart.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.images[0],
                        quantity: quantity
                    });
                }
                
                // Save updated cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Show success message
                const button = document.querySelector(".cart-button");
                const message = document.getElementById("message");
                
                button.textContent = "✔ Added!";
                message.style.opacity = 1;
                
                setTimeout(() => {
                    button.textContent = "🛒 Add to Cart";
                    message.style.opacity = 0;
                }, 1500);
                
                // Update cart counter if exists
                updateCartCounter();
            }
        })
        .catch(error => console.error('Error loading product:', error));
}

function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}