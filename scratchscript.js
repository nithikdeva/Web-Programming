// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to 'light'
const savedTheme = localStorage.getItem('theme') || 'light';
body.dataset.theme = savedTheme;
updateThemeIcon();

function toggleTheme() {
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', body.dataset.theme);
    updateThemeIcon();
    updateBackgroundOpacity();
}

function updateThemeIcon() {
    if (body.dataset.theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

function updateBackgroundOpacity() {
    const opacity = body.dataset.theme === 'dark' ? '0.7' : '0.9';
    document.body.style.setProperty('--bg-opacity', opacity);
}

themeToggle.addEventListener('click', toggleTheme);

// Countdown Timer
let timer;
let timeLeft;
let isPaused = false;
const timerInput = document.getElementById('timerInput');
const timerDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startTimer');
const pauseBtn = document.getElementById('pauseTimer');
const resetBtn = document.getElementById('resetTimer');

startBtn.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        startTimer(timeLeft);
    } else {
        const seconds = parseInt(timerInput.value);
        if (seconds > 0) {
            startTimer(seconds);
        } else {
            alert('Please enter a valid number of seconds');
        }
    }
});

pauseBtn.addEventListener('click', () => {
    clearInterval(timer);
    isPaused = true;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timer);
    isPaused = false;
    timerDisplay.textContent = '00:00';
    timerDisplay.style.background = '#2ecc71';
    timerInput.value = '';
});

function startTimer(duration) {
    clearInterval(timer);
    timeLeft = duration;
    updateDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerDisplay.textContent = 'Time\'s Up!';
        }
    }, 1000);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update background color based on time left
    if (timeLeft > 10) {
        timerDisplay.style.background = '#2ecc71'; // Green
    } else if (timeLeft > 5) {
        timerDisplay.style.background = '#f1c40f'; // Yellow
    } else {
        timerDisplay.style.background = '#e74c3c'; // Red
    }
}

// Sneaker List Operations
function sortList(direction) {
    const grid = document.getElementById('sneakerGrid');
    const items = Array.from(grid.getElementsByClassName('sneaker-card'));
    
    items.sort((a, b) => {
        const nameA = a.querySelector('h3').textContent.toUpperCase();
        const nameB = b.querySelector('h3').textContent.toUpperCase();
        const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
        
        if (direction === 'alpha') {
            return nameA.localeCompare(nameB);
        } else if (direction === 'reverse') {
            return nameB.localeCompare(nameA);
        } else if (direction === 'price-low') {
            return priceA - priceB;
        } else if (direction === 'price-high') {
            return priceB - priceA;
        }
    });
    
    // Clear grid and append sorted items
    grid.innerHTML = '';
    items.forEach(item => grid.appendChild(item));
}

function searchSneakers() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const grid = document.getElementById('sneakerGrid');
    const items = grid.getElementsByClassName('sneaker-card');
    
    for (let i = 0; i < items.length; i++) {
        const name = items[i].querySelector('h3').textContent;
        if (name.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}

function filterDuplicates() {
    const list = document.getElementById('sneakerList');
    const items = Array.from(list.getElementsByTagName('li'));
    const uniqueTexts = new Set();
    const uniqueItems = [];
    
    items.forEach(item => {
        const text = item.textContent.trim();
        if (!uniqueTexts.has(text)) {
            uniqueTexts.add(text);
            uniqueItems.push(item);
        }
    });
    
    // Clear list and append unique items
    list.innerHTML = '';
    uniqueItems.forEach(item => list.appendChild(item));
}

// Inventory Table
const inventoryForm = document.getElementById('inventoryForm');
const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];

// Load saved inventory from localStorage
loadInventory();

inventoryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const model = document.getElementById('model').value;
    const size = document.getElementById('size').value;
    const price = document.getElementById('price').value;
    
    addSneakerToInventory(model, size, price);
    
    // Reset form
    inventoryForm.reset();
});

function addSneakerToInventory(model, size, price, isLoading = false) {
    const row = inventoryTable.insertRow();
    
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    
    cell1.textContent = model;
    cell2.textContent = size;
    cell3.textContent = `$${parseFloat(price).toFixed(2)}`;
    
    // Action buttons
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'action-btn';
    editBtn.onclick = function() {
        editRow(row);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.onclick = function() {
        deleteRow(row);
    };
    
    cell4.appendChild(editBtn);
    cell4.appendChild(document.createTextNode(' '));
    cell4.appendChild(deleteBtn);
    
    if (!isLoading) {
        saveInventory();
    }
}

function editRow(row) {
    const cells = row.cells;
    
    const model = cells[0].textContent;
    const size = cells[1].textContent;
    const price = cells[2].textContent.replace('$', '');
    
    cells[0].innerHTML = `<input type="text" value="${model}">`;
    cells[1].innerHTML = `<input type="number" value="${size}" min="3" max="15" step="0.5">`;
    cells[2].innerHTML = `<input type="number" value="${price}" min="0">`;
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'action-btn';
    saveBtn.onclick = function() {
        saveEdit(row);
    };
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'action-btn delete-btn';
    cancelBtn.onclick = function() {
        cancelEdit(row, model, size, price);
    };
    
    cells[3].innerHTML = '';
    cells[3].appendChild(saveBtn);
    cells[3].appendChild(document.createTextNode(' '));
    cells[3].appendChild(cancelBtn);
}

function saveEdit(row) {
    const cells = row.cells;
    
    const model = cells[0].querySelector('input').value;
    const size = cells[1].querySelector('input').value;
    const price = cells[2].querySelector('input').value;
    
    cells[0].textContent = model;
    cells[1].textContent = size;
    cells[2].textContent = `$${parseFloat(price).toFixed(2)}`;
    
    // Restore action buttons
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'action-btn';
    editBtn.onclick = function() {
        editRow(row);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.onclick = function() {
        deleteRow(row);
    };
    
    cells[3].innerHTML = '';
    cells[3].appendChild(editBtn);
    cells[3].appendChild(document.createTextNode(' '));
    cells[3].appendChild(deleteBtn);
    
    saveInventory();
}

function cancelEdit(row, model, size, price) {
    const cells = row.cells;
    
    cells[0].textContent = model;
    cells[1].textContent = size;
    cells[2].textContent = `$${price}`;
    
    // Restore action buttons
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'action-btn';
    editBtn.onclick = function() {
        editRow(row);
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.onclick = function() {
        deleteRow(row);
    };
    
    cells[3].innerHTML = '';
    cells[3].appendChild(editBtn);
    cells[3].appendChild(document.createTextNode(' '));
    cells[3].appendChild(deleteBtn);
}

function deleteRow(row) {
    if (confirm('Are you sure you want to delete this item?')) {
        row.remove();
        saveInventory();
    }
}

function saveInventory() {
    const inventory = [];
    const rows = inventoryTable.rows;
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        inventory.push({
            model: cells[0].textContent,
            size: cells[1].textContent,
            price: cells[2].textContent.replace('$', '')
        });
    }
    
    localStorage.setItem('sneakerInventory', JSON.stringify(inventory));
}

function loadInventory() {
    const savedInventory = localStorage.getItem('sneakerInventory');
    
    if (savedInventory) {
        const inventory = JSON.parse(savedInventory);
        
        inventory.forEach(item => {
            addSneakerToInventory(item.model, item.size, item.price, true);
        });
    }
}

// Sneaker Detail Modal
const sneakerCards = document.querySelectorAll('.sneaker-card');
const sneakerModal = document.getElementById('sneakerModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalRating = document.getElementById('modalRating');
const ratingStars = document.getElementById('ratingStars');
const closeModal = document.querySelector('.close');

sneakerCards.forEach(card => {
    card.addEventListener('click', function() {
        // Get sneaker details
        const img = this.querySelector('img').src;
        const title = this.querySelector('h3').textContent;
        const price = this.querySelector('.price').textContent;
        const rating = this.getAttribute('data-rating');
        
        // Populate modal
        modalImg.src = img;
        modalTitle.textContent = title;
        modalPrice.textContent = price;
        modalRating.textContent = rating + '/5';
        
        // Generate stars based on rating
        const starCount = Math.round(parseFloat(rating));
        ratingStars.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            if (i < starCount) {
                ratingStars.innerHTML += '<i class="fas fa-star"></i>';
            } else {
                ratingStars.innerHTML += '<i class="far fa-star"></i>';
            }
        }
        
        // Show modal
        sneakerModal.style.display = 'block';
    });
});

closeModal.addEventListener('click', function() {
    sneakerModal.style.display = 'none';
});

// Close modal when clicking outside the content
window.addEventListener('click', function(event) {
    if (event.target === sneakerModal) {
        sneakerModal.style.display = 'none';
    }
});

// Call this function on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBackgroundOpacity();
    loadInventory();
});
