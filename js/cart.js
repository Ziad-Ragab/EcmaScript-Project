document.addEventListener('DOMContentLoaded', function() {
    // Get cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBody = document.getElementById('cart-body');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');

    // Function to update cart display
    function updateCartDisplay() {
        // Clear existing cart items
        if (cartBody) cartBody.innerHTML = '';

        let subtotal = 0;

        // Add each product to the cart table
        cart.forEach((item, index) => {
            // Ensure price is treated as a number
            const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.title}"></td>
                <td>${item.title}</td>
                <td class="price">${price.toFixed(2)} EGP</td>
                <td><input type="number" class="quantity" value="${item.quantity}" min="1" data-index="${index}"></td>
                <td class="subtotal">${itemTotal.toFixed(2)} EGP</td>
                <td><button class="remove" data-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                </button></td>
            `;
            if (cartBody) cartBody.appendChild(row);
        });

        // Update totals if elements exist
        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
        if (totalElement) totalElement.textContent = subtotal.toFixed(2);

        // Add event listeners to quantity inputs
        document.querySelectorAll('.quantity').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.dataset.index);
                const newQuantity = parseInt(this.value);
                
                if (newQuantity > 0) {
                    cart[index].quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                } else {
                    this.value = cart[index].quantity; // Reset to previous value
                }
            });
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCounter(); // Update cart counter in header if exists
            });
        });
    }

    // Function to update cart counter in header (if exists)
    function updateCartCounter() {
        const cartCounter = document.querySelector('.cart-counter');
        if (cartCounter) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Checkout button functionality
    const checkoutButton = document.querySelector('.checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length > 0) {
                // Here you would typically redirect to checkout page
                alert('Proceeding to checkout!');
                // localStorage.removeItem('cart'); // Clear cart after checkout
                // updateCartDisplay();
                // updateCartCounter();
            } else {
                alert('Your cart is empty!');
            }
        });
    }

    // Initialize cart display
    updateCartDisplay();
});