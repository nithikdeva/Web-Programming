// =================== CLASSES ===================

// Product Class
class Product {
    constructor(id, name, price, image, description = 'No description available.', rating = 0, ratingCount = 0) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.rating = rating;
        this.ratingCount = ratingCount;
    }

    render() {
        const starRating = this.generateStarRating();
        return `
            <div class="product-card" data-id="${this.id}">
                <div class="wishlist-btn" data-id="${this.id}">
                    <i class="${wishlist.hasItem(this.id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
                </div>
                <img src="${this.image}" alt="${this.name}" class="product-thumbnail">
                <div class="product-details">
                    <h3>${this.name}</h3>
                    <p>$${this.price.toFixed(2)}</p>
                    <div class="rating-display">${starRating}</div>
                    <div class="button-group">
                        <button class="add-to-cart" data-id="${this.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="quick-view" data-id="${this.id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
   
    generateStarRating() {
        let starsHtml = '';
        const fullStars = Math.floor(this.rating);
        const hasHalfStar = this.rating % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        starsHtml += `<span class="rating-count">(${this.ratingCount})</span>`;
        return starsHtml;
    }
}

// Cart Class with draggable functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartElement = document.getElementById('cart-items');
        this.totalElement = document.createElement('div');
        this.totalElement.classList.add('cart-total');
        
        if (!this.cartElement) {
            this.createCartUI();
        } else {
            this.cartElement.parentNode.appendChild(this.totalElement);
            this.setupCartEvents();
        }
        this.updateCart();
    }

    createCartUI() {
        // Create cart container with a drag handle
        const cartContainer = document.createElement('div');
        cartContainer.id = 'cart';
        cartContainer.classList.add('cart-sidebar');
        cartContainer.innerHTML = `
            <div class="drag-handle">Drag Me</div>
            <h2><i class="fas fa-shopping-cart"></i> Shopping Cart</h2>
            <div id="cart-items">
                <p>Your cart is empty!</p>
            </div>
            <div class="cart-actions">
                <button id="clear-cart" class="cart-btn">Clear Cart</button>
                <button id="checkout" class="cart-btn primary">Checkout</button>
            </div>
        `;
        // Append to the content wrapper
        const contentWrapper = document.querySelector('.content-wrapper');
        contentWrapper.appendChild(cartContainer);
        this.cartElement = document.getElementById('cart-items');
        this.cartElement.parentNode.appendChild(this.totalElement);
        this.setupCartEvents();
        // Make the cart draggable
        makeDraggable(cartContainer, cartContainer.querySelector('.drag-handle'));
    }

    setupCartEvents() {
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }
        const checkoutBtn = document.getElementById('checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    alert('Thank you for your purchase! Your order has been placed.');
                    this.clearCart();
                } else {
                    alert('Your cart is empty. Add some items before checking out.');
                }
            });
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            const productWithQuantity = { ...product, quantity: 1 };
            this.items.push(productWithQuantity);
        }
        this.saveCart();
        this.updateCart();
    }

    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveCart();
            this.updateCart();
        }
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.updateCart();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }

    updateCart() {
        if (this.items.length === 0) {
            this.cartElement.innerHTML = '<p>Your cart is empty!</p>';
            this.totalElement.innerHTML = `<div class="cart-total-details"><strong>Total:</strong> $0.00</div>`;
        } else {
            const cartItemsHTML = this.items.map((item, index) => `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} × ${item.quantity || 1}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity || 1}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            this.cartElement.innerHTML = cartItemsHTML;
            const total = this.calculateTotal();
            this.totalElement.innerHTML = `
                <div class="cart-total-details">
                    <strong>Total:</strong> $${total.toFixed(2)}
                </div>
            `;
            
            document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const item = this.items.find(item => item.id === productId);
                    if (item && item.quantity > 1) {
                        this.updateQuantity(productId, item.quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const item = this.items.find(item => item.id === productId);
                    if (item) {
                        this.updateQuantity(productId, item.quantity + 1);
                    }
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.closest('.remove-item').dataset.id);
                    this.removeItem(productId);
                });
            });
        }
    }
}

// Wishlist Class
class Wishlist {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }
   
    loadFromStorage() {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            this.items = JSON.parse(savedWishlist);
        }
    }
   
    saveToStorage() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }
   
    addItem(productId) {
        if (!this.items.includes(productId)) {
            this.items.push(productId);
            this.saveToStorage();
        }
    }
   
    removeItem(productId) {
        const index = this.items.indexOf(productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveToStorage();
        }
    }
   
    hasItem(productId) {
        return this.items.includes(productId);
    }
   
    updateUI() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.id);
            if (this.hasItem(productId)) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.classList.add('active');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.classList.remove('active');
            }
        });
    }
}

// RatingSystem Class
class RatingSystem {
    constructor() {
        this.ratings = {};
        this.reviews = {};
        this.loadFromStorage();
    }
   
    loadFromStorage() {
        const savedRatings = localStorage.getItem('ratings');
        if (savedRatings) this.ratings = JSON.parse(savedRatings);
        const savedReviews = localStorage.getItem('reviews');
        if (savedReviews) this.reviews = JSON.parse(savedReviews);
    }
   
    saveToStorage() {
        localStorage.setItem('ratings', JSON.stringify(this.ratings));
        localStorage.setItem('reviews', JSON.stringify(this.reviews));
    }
   
    submitRating(productId, rating, reviewText = '') {
        if (!this.ratings[productId]) {
            this.ratings[productId] = [];
        }
        this.ratings[productId].push(rating);
        if (reviewText.trim()) {
            if (!this.reviews[productId]) {
                this.reviews[productId] = [];
            }
            this.reviews[productId].push({
                rating,
                text: reviewText,
                date: new Date().toLocaleDateString()
            });
        }
        this.saveToStorage();
        const product = ninjagoProducts.find(p => p.id === productId);
        if (product) {
            product.ratingCount = this.ratings[productId].length;
            product.rating = this.getAverageRating(productId);
        }
    }
   
    getAverageRating(productId) {
        const productRatings = this.ratings[productId];
        if (!productRatings || productRatings.length === 0) return 0;
        const sum = productRatings.reduce((total, rating) => total + rating, 0);
        return sum / productRatings.length;
    }
   
    getReviews(productId) {
        return this.reviews[productId] || [];
    }
   
    hasUserRated(productId) {
        return this.ratings[productId] && this.ratings[productId].length > 0;
    }

    createRatingUI(productId) {
        const hasRated = this.hasUserRated(productId);
        const averageRating = this.getAverageRating(productId);
        if (hasRated) {
            return `
                <div class="rating-ui">
                    <p>Average Rating: ${averageRating.toFixed(1)} (${this.ratings[productId].length} ratings)</p>
                    <div class="stars-container">
                        ${this.generateStarRating(averageRating)}
                    </div>
                    <p>Thank you for your rating!</p>
                </div>
            `;
        } else {
            return `
                <div class="rating-ui">
                    <p>Rate this product:</p>
                    <div class="stars-container">
                        <span class="star" data-value="1">☆</span>
                        <span class="star" data-value="2">☆</span>
                        <span class="star" data-value="3">☆</span>
                        <span class="star" data-value="4">☆</span>
                        <span class="star" data-value="5">☆</span>
                    </div>
                    <button id="submit-rating" disabled>Submit Rating</button>
                </div>
            `;
        }
    }
    
    generateStarRating(rating) {
        let starsHtml = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<span class="star full">★</span>';
        }
        if (hasHalfStar) {
            starsHtml += '<span class="star half">★</span>';
        }
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<span class="star">☆</span>';
        }
        return starsHtml;
    }
}

// ThemeToggle Class (uses existing button if present)
class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        // Check if button exists in HTML
        this.button = document.getElementById('theme-toggle-btn');
        if (!this.button) {
            // Create one if not exists
            const themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = `
                <button id="theme-toggle-btn" title="Toggle Dark/Light Mode">
                    <i class="fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
                </button>
            `;
            document.querySelector('header').appendChild(themeToggle);
            this.button = document.getElementById('theme-toggle-btn');
        }
        this.button.addEventListener('click', () => this.toggleTheme());
        this.applyTheme();
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }
    
    applyTheme() {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${this.theme}-theme`);
        if (this.button) {
            this.button.innerHTML = `<i class="fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>`;
        }
    }
}

// CountdownTimer Class (unchanged)
class CountdownTimer {
    constructor() {
        this.seconds = 0;
        this.interval = null;
        this.isPaused = true;
        this.createTimerUI();
        this.setupEventListeners();
    }
    
    createTimerUI() {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'countdown-timer';
        timerContainer.innerHTML = `
            <h3>Countdown Timer</h3>
            <div class="timer-display">
                <span id="timer-minutes">00</span>:<span id="timer-seconds">00</span>
            </div>
            <div class="timer-input">
                <input type="number" id="timer-input" min="1" max="3600" placeholder="Enter seconds">
                <button id="timer-start" class="timer-btn">Start</button>
                <button id="timer-pause" class="timer-btn" disabled>Pause</button>
                <button id="timer-reset" class="timer-btn" disabled>Reset</button>
            </div>
        `;
        const containerElement = document.querySelector('.container');
        containerElement.insertBefore(timerContainer, containerElement.firstChild);
        this.minutesDisplay = document.getElementById('timer-minutes');
        this.secondsDisplay = document.getElementById('timer-seconds');
        this.timerContainer = timerContainer;
    }
    
    setupEventListeners() {
        document.getElementById('timer-start').addEventListener('click', () => {
            if (this.isPaused) {
                if (this.seconds === 0) {
                    const inputSeconds = parseInt(document.getElementById('timer-input').value);
                    if (isNaN(inputSeconds) || inputSeconds <= 0) {
                        alert('Please enter a valid number of seconds.');
                        return;
                    }
                    this.seconds = inputSeconds;
                }
                this.startTimer();
            }
        });
        
        document.getElementById('timer-pause').addEventListener('click', () => {
            this.pauseTimer();
        });
        
        document.getElementById('timer-reset').addEventListener('click', () => {
            this.resetTimer();
        });
    }
    
    startTimer() {
        this.isPaused = false;
        document.getElementById('timer-start').disabled = true;
        document.getElementById('timer-pause').disabled = false;
        document.getElementById('timer-reset').disabled = false;
        this.updateDisplay();
        this.interval = setInterval(() => {
            if (this.seconds > 0) {
                this.seconds--;
                this.updateDisplay();
                this.updateBackgroundColor();
            } else {
                this.finishTimer();
            }
        }, 1000);
    }
    
    pauseTimer() {
        this.isPaused = true;
        clearInterval(this.interval);
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
        document.getElementById('timer-start').textContent = 'Resume';
    }
    
    resetTimer() {
        this.isPaused = true;
        clearInterval(this.interval);
        this.seconds = 0;
        this.updateDisplay();
        this.updateBackgroundColor();
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
        document.getElementById('timer-reset').disabled = true;
        document.getElementById('timer-start').textContent = 'Start';
    }
    
    finishTimer() {
        clearInterval(this.interval);
        this.isPaused = true;
        document.getElementById('timer-start').disabled = false;
        document.getElementById('timer-pause').disabled = true;
        document.getElementById('timer-reset').disabled = false;
        document.getElementById('timer-start').textContent = 'Start';
        alert('Timer finished!');
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateBackgroundColor() {
        this.timerContainer.classList.remove('timer-green', 'timer-yellow', 'timer-red');
        if (this.seconds > 10) {
            this.timerContainer.classList.add('timer-green');
        } else if (this.seconds > 5) {
            this.timerContainer.classList.add('timer-yellow');
        } else {
            this.timerContainer.classList.add('timer-red');
        }
    }
}

// DynamicTable Class (unchanged)
class DynamicTable {
    constructor() {
        this.data = [];
        this.createTableUI();
        this.setupEventListeners();
    }
    
    createTableUI() {
        const tableContainer = document.createElement('div');
        tableContainer.className = 'dynamic-table-container';
        tableContainer.innerHTML = `
            <h3>Manage Products</h3>
            <div class="table-controls">
                <button id="add-row" class="table-btn">Add New Product</button>
                <button id="sort-table" class="table-btn">Sort Alphabetically</button>
                <button id="filter-table" class="table-btn">Remove Duplicates</button>
                <button id="reverse-table" class="table-btn">Reverse Order</button>
            </div>
            <table id="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>
            <div id="add-form" class="form-container" style="display: none;">
                <h4>Add New Product</h4>
                <form id="product-form">
                    <div class="form-group">
                        <label for="product-name">Name:</label>
                        <input type="text" id="product-name" required>
                    </div>
                    <div class="form-group">
                        <label for="product-price">Price:</label>
                        <input type="number" id="product-price" min="0.01" step="0.01" required>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" class="form-btn">Add Product</button>
                        <button type="button" id="cancel-add" class="form-btn">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.querySelector('.container').appendChild(tableContainer);
        this.data = ninjagoProducts.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price
        }));
        this.renderTable();
    }
    
    setupEventListeners() {
        document.getElementById('add-row').addEventListener('click', () => {
            document.getElementById('add-form').style.display = 'block';
        });
        document.getElementById('cancel-add').addEventListener('click', () => {
            document.getElementById('add-form').style.display = 'none';
            document.getElementById('product-form').reset();
        });
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewProduct();
        });
        document.getElementById('sort-table').addEventListener('click', () => {
            this.sortTable();
        });
        document.getElementById('filter-table').addEventListener('click', () => {
            this.filterDuplicates();
        });
        document.getElementById('reverse-table').addEventListener('click', () => {
            this.reverseTable();
        });
        document.getElementById('table-body').addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                this.editRow(e.target.closest('tr').dataset.id);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteRow(e.target.closest('tr').dataset.id);
            }
        });
    }
    
    renderTable() {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        this.data.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            row.innerHTML = `
                <td>${item.id}</td>
                <td class="product-name">${item.name}</td>
                <td class="product-price">$${item.price.toFixed(2)}</td>
                <td>
                    <button class="edit-btn table-action-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn table-action-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    addNewProduct() {
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        if (!name || isNaN(price)) {
            alert('Please enter valid product details.');
            return;
        }
        const newId = this.data.length > 0 ? Math.max(...this.data.map(item => item.id)) + 1 : 1;
        this.data.push({ id: newId, name: name, price: price });
        this.renderTable();
        document.getElementById('add-form').style.display = 'none';
        document.getElementById('product-form').reset();
    }
    
    editRow(id) {
        id = parseInt(id);
        const item = this.data.find(item => item.id === id);
        if (!item) return;
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const nameCell = row.querySelector('.product-name');
        const priceCell = row.querySelector('.product-price');
        if (nameCell.querySelector('input')) return;
        const currentName = nameCell.textContent;
        const currentPrice = parseFloat(priceCell.textContent.substring(1));
        nameCell.innerHTML = `<input type="text" value="${currentName}" class="edit-input">`;
        priceCell.innerHTML = `<input type="number" value="${currentPrice}" step="0.01" min="0.01" class="edit-input">`;
        const actionCell = row.querySelector('td:last-child');
        actionCell.innerHTML = `
            <button class="save-btn table-action-btn">
                <i class="fas fa-save"></i>
            </button>
            <button class="cancel-btn table-action-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        actionCell.querySelector('.save-btn').addEventListener('click', () => {
            this.saveRow(id, row);
        });
        actionCell.querySelector('.cancel-btn').addEventListener('click', () => {
            this.cancelEdit(id);
        });
    }
    
    saveRow(id, row) {
        const nameInput = row.querySelector('.product-name input');
        const priceInput = row.querySelector('.product-price input');
        const newName = nameInput.value;
        const newPrice = parseFloat(priceInput.value);
        if (!newName || isNaN(newPrice)) {
            alert('Please enter valid product details.');
            return;
        }
        const item = this.data.find(item => item.id === id);
        if (item) {
            item.name = newName;
            item.price = newPrice;
        }
        this.renderTable();
    }
    
    cancelEdit(id) {
        this.renderTable();
    }
    
    deleteRow(id) {
        id = parseInt(id);
        if (confirm('Are you sure you want to delete this product?')) {
            this.data = this.data.filter(item => item.id !== id);
            this.renderTable();
        }
    }
    
    sortTable() {
        this.data.sort((a, b) => a.name.localeCompare(b.name));
        this.renderTable();
    }
    
    filterDuplicates() {
        const uniqueNames = new Set();
        this.data = this.data.filter(item => {
            if (uniqueNames.has(item.name)) return false;
            uniqueNames.add(item.name);
            return true;
        });
        this.renderTable();
    }
    
    reverseTable() {
        this.data.reverse();
        this.renderTable();
    }
}

// ImageGallery Class
class ImageGallery {
    constructor() {
        this.createGalleryUI();
        this.setupEventListeners();
    }
    
    createGalleryUI() {
        const galleryContainer = document.createElement('div');
        galleryContainer.className = 'image-gallery-container';
        galleryContainer.innerHTML = `
            <h3>Ninjago Gallery</h3>
            <div class="gallery-thumbnails">
                ${ninjagoProducts.map(product => `
                    <div class="gallery-thumbnail" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                `).join('')}
            </div>
            <div class="gallery-preview">
                <img id="gallery-preview-img" src="${ninjagoProducts[0].image}" alt="${ninjagoProducts[0].name}">
                <h4 id="gallery-preview-title">${ninjagoProducts[0].name}</h4>
            </div>
        `;
        document.querySelector('.container').appendChild(galleryContainer);
    }
    
    setupEventListeners() {
        document.querySelectorAll('.gallery-thumbnail').forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const productId = parseInt(thumbnail.dataset.id);
                const product = ninjagoProducts.find(p => p.id === productId);
                if (product) {
                    document.getElementById('gallery-preview-img').src = product.image;
                    document.getElementById('gallery-preview-title').textContent = product.name;
                    document.querySelectorAll('.gallery-thumbnail').forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                }
            });
        });
    }
}

// =================== HELPER FUNCTIONS ===================

// Draggable functionality for an element using a handle
function makeDraggable(element, handle) {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    handle.style.cursor = 'move';
    handle.addEventListener('mousedown', mouseDownHandler);
  
    function mouseDownHandler(e) {
        pos = {
            left: element.offsetLeft,
            top: element.offsetTop,
            x: e.clientX,
            y: e.clientY
        };
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }
  
    function mouseMoveHandler(e) {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
        element.style.position = 'fixed';
        element.style.left = `${pos.left + dx}px`;
        element.style.top = `${pos.top + dy}px`;
    }
  
    function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }
}

// =================== APP INITIALIZATION & EVENT HANDLERS ===================

document.addEventListener('DOMContentLoaded', () => {
    // Fix logo centering by ensuring the h1 container centers its content
    const headerH1 = document.querySelector('.header-wrapper h1');
    if (headerH1) {
        headerH1.style.display = 'flex';
        headerH1.style.alignItems = 'center';
        headerH1.style.justifyContent = 'center';
    }
    
    // Global Instances and Variables
    const productContainer = document.getElementById('product-container');
    if (!productContainer) {
        console.error("Error: #product-container not found in HTML.");
        return;
    }
    const cart = new Cart();
    const wishlist = new Wishlist();
    const ratingSystem = new RatingSystem();
    const themeToggle = new ThemeToggle();
    
    // Modal Elements
    const modal = document.getElementById('product-modal');
    const overlay = document.getElementById('overlay');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const modalRatingContainer = document.createElement('div');
    modalRatingContainer.id = 'modal-rating';
    modal.insertBefore(modalRatingContainer, modalDescription.nextSibling);
    
    // Product Data Array
    const ninjagoProducts = [
        new Product(1, 'Ninjago City Gardens', 299.99, 'https://m.media-amazon.com/images/I/61MNqhS4zAL.jpg', 'Build the majestic Ninjago City Gardens!', 4.8, 152),
        new Product(2, 'Lloyd\'s Titan Mech', 79.99, 'https://www.hamleys.com/media/catalog/product/5/8/582692_alt1_r8gjsitshyfugwqi.jpg?quality=80&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:', 'Pilot Lloyd\'s powerful Titan Mech!', 4.5, 87),
        new Product(3, 'Kai\'s Fire Dragon', 49.99, 'https://m.media-amazon.com/images/I/71VSjVyLEwL.jpg', 'Ride Kai\'s fiery dragon into battle!', 4.2, 63),
        new Product(4, 'Zane\'s Titanium Ninja Mech', 59.99, 'https://rukminim2.flixcart.com/image/850/1000/xif0q/block-construction/g/r/e/ninjago-legacy-zane-39-s-titan-mech-battle-ninja-toy-kit-71738-original-imaghkzbaub9hepe.jpeg?q=90&crop=false', 'Control Zane\'s titanium-powered mech!', 4.7, 49),
        new Product(5, 'Dragon Master Temple', 129.99, 'https://thatbricksite.com/wp-content/uploads/2021/08/70751-Ninjago-Temple-of-Airjitsu-1.jpg', 'An epic dragon sanctuary with multiple chambers and detailed architecture!', 4.9, 78),
        new Product(6, 'Hydro Bounty Submarine', 89.99, 'https://images-cdn.ubuy.co.in/660f1da3b53ec70ff006fe8e-lego-ninjago-hydro-bounty-building-set.jpg', 'A high-tech underwater vessel for underwater ninja missions!', 4.1, 42),
        new Product(7, 'Destiny\'s Bounty', 19.99, 'https://images-cdn.ubuy.co.in/65adb151f2a5e0466d4ccf31-ninjago-destiny-39-s-bounty-set.jpg', 'Practice Spinjitzu techniques with this compact training set!', 3.9, 35),
        new Product(8, 'Mountain Temple', 39.99, 'https://static.thcdn.com/images/large/original/productimg/1600/1600/11885581-6924629717845877.jpg', 'Protect the Temple!', 4.4, 27)
    ];
    
    // Render Products Function
    function renderProducts(products) {
        productContainer.innerHTML = products.map(product => product.render()).join('');
        wishlist.updateUI();
    }
    
    renderProducts(ninjagoProducts);
    
    // Global Event Listeners
    document.addEventListener('click', (e) => {
        // Add to Cart
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            const selectedProduct = ninjagoProducts.find(p => p.id === productId);
            cart.addItem(selectedProduct);
        }
    
        // Remove item from Cart
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.dataset.id);
            cart.removeItem(productId);
        }
    
        // Wishlist Toggle
        if (e.target.classList.contains('wishlist-btn')) {
            const productId = parseInt(e.target.dataset.id);
            if (wishlist.hasItem(productId)) {
                wishlist.removeItem(productId);
            } else {
                wishlist.addItem(productId);
            }
            wishlist.updateUI();
        }
    
        // Show Product Modal
        if (e.target.closest('.product-card') && !e.target.classList.contains('wishlist-btn') && !e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.closest('.product-card').dataset.id);
            const product = ninjagoProducts.find(p => p.id === productId);
           
            modalImage.src = product.image;
            modalName.textContent = product.name;
            modalPrice.textContent = `$${product.price.toFixed(2)}`;
            modalDescription.textContent = product.description;
           
            modalRatingContainer.innerHTML = ratingSystem.createRatingUI(productId);
           
            modal.setAttribute('data-product-id', productId);
            modal.style.display = 'block';
            overlay.style.display = 'block';
           
            const stars = modalRatingContainer.querySelectorAll('.star');
            stars.forEach(star => {
                star.addEventListener('mouseover', function() {
                    const value = parseInt(this.dataset.value);
                    highlightStars(stars, value);
                });
            });
           
            const starsContainer = modalRatingContainer.querySelector('.stars-container');
            if (starsContainer) {
                starsContainer.addEventListener('mouseleave', function() {
                    stars.forEach(star => star.classList.remove('selected'));
                });
            }
           
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const value = parseInt(this.dataset.value);
                    highlightStars(stars, value, true);
                    const submitBtn = document.getElementById('submit-rating');
                    submitBtn.removeAttribute('disabled');
                    submitBtn.dataset.selectedRating = value;
                });
            });
           
            const submitBtn = document.getElementById('submit-rating');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.addEventListener('click', function() {
                    const rating = parseInt(this.dataset.selectedRating || 0);
                    if (rating > 0) {
                        const productId = parseInt(modal.getAttribute('data-product-id'));
                        ratingSystem.submitRating(productId, rating);
                        modalRatingContainer.innerHTML = ratingSystem.createRatingUI(productId);
                        renderProducts(ninjagoProducts);
                    }
                });
            }
        }
    
        // Close Modal
        if (e.target.id === 'close-modal' || e.target.id === 'overlay') {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
    
    // Helper: Highlight Stars Function
    function highlightStars(stars, value, permanent = false) {
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= value) {
                star.textContent = '★';
                if (permanent) star.classList.add('selected');
            } else {
                star.textContent = '☆';
                if (permanent) star.classList.remove('selected');
            }
        });
    }
    
    // Search Functionality
    document.getElementById('search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = ninjagoProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });
    
    // Sort Functionality
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
            case 'rating-desc':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
        }
        renderProducts(sortedProducts);
    });
    
    // Update Sort Options to Include Rating
    document.getElementById('sort').innerHTML = `
        <option value="name-asc">Sort by Name (A-Z)</option>
        <option value="name-desc">Sort by Name (Z-A)</option>
        <option value="price-asc">Sort by Price (Low to High)</option>
        <option value="price-desc">Sort by Price (High to Low)</option>
        <option value="rating-desc">Sort by Rating (Highest First)</option>
    `;
    
    // Wishlist Toggle Button Setup (without using arguments.callee)
    if (!document.getElementById('show-wishlist-btn')) {
        document.querySelector('header').innerHTML += `
            <div class="wishlist-toggle">
                <button id="show-wishlist-btn" data-showing="all">
                    <span id="wishlist-icon">☆</span> <span id="wishlist-text">Show Wishlist</span>
                </button>
            </div>
        `;
    }
    
    function toggleWishlist() {
        const btn = document.getElementById('show-wishlist-btn');
        if (btn.dataset.showing === 'wishlist') {
            renderProducts(ninjagoProducts);
            btn.innerHTML = `<span id="wishlist-icon">☆</span> <span id="wishlist-text">Show Wishlist</span>`;
            btn.dataset.showing = 'all';
        } else {
            const wishlistProducts = ninjagoProducts.filter(product => wishlist.hasItem(product.id));
            if (wishlistProducts.length === 0) {
                alert('Your wishlist is empty!');
                return;
            }
            renderProducts(wishlistProducts);
            btn.innerHTML = `<span id="wishlist-icon">☆</span> <span id="wishlist-text">Show All Products</span>`;
            btn.dataset.showing = 'wishlist';
        }
    }
    
    document.getElementById('show-wishlist-btn').addEventListener('click', toggleWishlist);
});
