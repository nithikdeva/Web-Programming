class Product {
    constructor(id, name, price, image, description = 'No description available.') {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
    }

    render() {
        return `
            <div class="product-card" data-id="${this.id}">
                <img src="${this.image}" alt="${this.name}">
                <div class="product-details">
                    <h3>${this.name}</h3>
                    <p>$${this.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${this.id}">Add to Cart</button>
                </div>
            </div>
        `;
    }
}

class Cart {
    constructor() {
        this.items = [];
        this.cartElement = document.getElementById('cart-items');
        this.clearCartBtn = document.getElementById('clear-cart');

        // Create a total display element
        this.totalElement = document.createElement('div');
        this.totalElement.classList.add('cart-total');
        this.cartElement.parentNode.appendChild(this.totalElement); // Append to parent to avoid being overwritten

        // Event listener for clearing cart
        this.clearCartBtn.addEventListener('click', () => this.clearCart());

        this.updateCart();
    }

    addItem(product) {
        this.items.push(product);
        this.updateCart();
    }

    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.updateCart();
        }
    }

    clearCart() {
        this.items = [];
        this.updateCart();
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    updateCart() {
        if (this.items.length === 0) {
            // Show empty cart message
            this.cartElement.innerHTML = '<p>Your cart is empty!</p>';
            this.totalElement.innerHTML = `
                <div class="cart-total-details">
                    <strong>Total:</strong> $0.00
                </div>
            `;
        } else {
            // Separate cart items from total display
            const cartItemsHTML = this.items.map((item, index) => `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `).join('');

            // Update cart with items
            this.cartElement.innerHTML = cartItemsHTML;

            // Update total display
            const total = this.calculateTotal();
            this.totalElement.innerHTML = `
                <div class="cart-total-details">
                    <strong>Total:</strong> $${total.toFixed(2)}
                </div>
            `;
        }
    }
}

const ninjagoProducts = [
    new Product(1, 'Ninjago City Gardens', 299.99, 'https://m.media-amazon.com/images/I/61MNqhS4zAL.jpg', 'Build the majestic Ninjago City Gardens!'),
    new Product(2, 'Lloyd\'s Titan Mech', 79.99, 'https://www.hamleys.com/media/catalog/product/5/8/582692_alt1_r8gjsitshyfugwqi.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:', 'Pilot Lloyd\'s powerful Titan Mech!'),
    new Product(3, 'Kai\'s Fire Dragon', 49.99, 'https://m.media-amazon.com/images/I/71VSjVyLEwL.jpg', 'Ride Kai\'s fiery dragon into battle!'),
    new Product(4, 'Zane\'s Titanium Ninja Mech', 59.99, 'https://rukminim2.flixcart.com/image/850/1000/xif0q/block-construction/g/r/e/ninjago-legacy-zane-39-s-titan-mech-battle-ninja-toy-kit-71738-original-imaghkzbaub9hepe.jpeg?q=90&crop=false', 'Control Zane\'s titanium-powered mech!'),
    new Product(5, 'Dragon Master Temple', 129.99, 'https://thatbricksite.com/wp-content/uploads/2021/08/70751-Ninjago-Temple-of-Airjitsu-1.jpg', 'An epic dragon sanctuary with multiple chambers and detailed architecture!'),
    new Product(6, 'Hydro Bounty Submarine', 89.99, 'https://images-cdn.ubuy.co.in/660f1da3b53ec70ff006fe8e-lego-ninjago-hydro-bounty-building-set.jpg', 'A high-tech underwater vessel for underwater ninja missions!'),
    new Product(7, 'Destiny\'s Bounty', 19.99, 'https://images-cdn.ubuy.co.in/65adb151f2a5e0466d4ccf31-ninjago-destiny-39-s-bounty-set.jpg', 'Practice Spinjitzu techniques with this compact training set!'),
    new Product(8, 'Mountain Temple', 39.99, 'https://static.thcdn.com/images/large/original/productimg/1600/1600/11885581-6924629717845877.jpg', 'Protect the Temple!')
];

const productContainer = document.getElementById('product-container');
const cart = new Cart();
const modal = document.getElementById('product-modal');
const overlay = document.getElementById('overlay');
const modalImage = document.getElementById('modal-image');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');

// Render products
function renderProducts(products) {
    productContainer.innerHTML = products.map(product => product.render()).join('');
}

renderProducts(ninjagoProducts);

// Event delegation for product and cart interactions
document.addEventListener('click', (e) => {
    // Add to cart
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        const selectedProduct = ninjagoProducts.find(p => p.id === productId);
        cart.addItem(selectedProduct);
    }

    // Remove item from cart
    if (e.target.classList.contains('remove-item')) {
        const productId = parseInt(e.target.dataset.id);
        cart.removeItem(productId);
    }

    // Show product modal
    if (e.target.closest('.product-card')) {
        const productId = parseInt(e.target.closest('.product-card').dataset.id);
        const product = ninjagoProducts.find(p => p.id === productId);
        modalImage.src = product.image;
        modalName.textContent = product.name;
        modalPrice.textContent = `$${product.price.toFixed(2)}`;
        modalDescription.textContent = product.description;
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Close modal
    if (e.target.id === 'close-modal' || e.target.id === 'overlay') {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
});

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = ninjagoProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
});

// Sort functionality
document.getElementById('sort').addEventListener('change', (e) => {
    const sortValue = e.target.value;
    let sortedProducts = [...ninjagoProducts];

    switch (sortValue) {
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
    }

    renderProducts(sortedProducts);
});