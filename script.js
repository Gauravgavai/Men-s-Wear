// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});

// Active nav link on scroll (sirf single-page sections ke liye)
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            navLinks.forEach(l => l.classList.remove('active-link'));
            const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
            if (active) active.classList.add('active-link');
        }
    });
});

// Scroll reveal for .fade-up elements
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


// Products array (initial + LocalStorage)
let products = [
    { id: 1, name: 'Cotton T-Shirt', price: 799, category: 'shirts', img: 'shirt1.jpg' },
    { id: 2, name: 'Slim Fit Jeans', price: 1999, category: 'jeans', img: 'jeans1.jpg' },
    { id: 3, name: 'Denim Jacket', price: 2999, category: 'jackets', img: 'jacket1.jpg' },
    { id: 4, name: 'Formal Shirt', price: 1299, category: 'shirts', img: 'shirt2.jpg' },
    { id: 5, name: 'Cargo Jeans', price: 2199, category: 'jeans', img: 'jeans2.jpg' },
    { id: 6, name: 'Leather Wallet', price: 599, category: 'accessories', img: 'wallet.jpg' }
];

// Load from LocalStorage
function loadProducts() {
    const saved = localStorage.getItem('menswear-products');
    if (saved) {
        products = JSON.parse(saved);
    }
    renderProducts();
}

// Cart
let cart = JSON.parse(localStorage.getItem('menswear-cart')) || [];

// Render Products
function renderProducts(filtered = products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    // agar products.html nahi hai to skip

    grid.innerHTML = filtered.map(p => `
    <div class="product-card fade-up" data-category="${p.category}">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x250?text=${p.name}'">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p class="meta-text">Premium fabric · Modern fit</p>
        <div class="price-row">
          <div class="price">₹${p.price}</div>
          <span class="tag">New</span>
        </div>
        <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');

    // Fade-up animation for new cards
    requestAnimationFrame(() => {
        document.querySelectorAll('.product-card.fade-up').forEach(el => {
            setTimeout(() => el.classList.add('show'), 100);
        });
    });
}

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const active = document.querySelector('.filter-btn.active');
        if (active) active.classList.remove('active');
        btn.classList.add('active');

        const category = btn.dataset.category;
        const filtered = category === 'all' ? products : products.filter(p => p.category === category);
        renderProducts(filtered);
    });
});

// Add to Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart.push(product);
    localStorage.setItem('menswear-cart', JSON.stringify(cart));
    updateCartCount();

    // Cart icon bounce animation
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('bump');
        setTimeout(() => cartIcon.classList.remove('bump'), 400);
    }

    showSuccess();
}

// Cart functions
function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = cart.length;
}

function showCart() {
    const items = document.getElementById('cart-items');
    const modal = document.getElementById('cart-modal');
    if (!items || !modal) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    items.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <span>${item.name}</span>
      <span>₹${item.price}</span>
    </div>
  `).join('') : '<p>Cart is empty</p>';

    document.getElementById('cart-total').textContent = total;
    modal.style.display = 'flex'; // drawer feel ke liye flex
}

// Cart button
const cartBtn = document.getElementById('cart-btn');
if (cartBtn) {
    cartBtn.addEventListener('click', showCart);
}

// Modal close (cart + admin)
document.querySelectorAll('.close').forEach(close => {
    close.addEventListener('click', () => {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) cartModal.style.display = 'none';

        const adminModal = document.getElementById('admin-panel');
        if (adminModal) adminModal.style.display = 'none';
    });
});

// Bahar click se sirf cart band karo (drawer)
window.onclick = (e) => {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal && e.target === cartModal) {
        cartModal.style.display = 'none';
    }
};

// Success msg
function showSuccess() {
    const msg = document.getElementById('success-msg');
    if (!msg) return;
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 2000);
}

// Admin Panel - Ctrl+Enter
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'Enter') {
        const pass = prompt('Enter admin PIN:');
        if (pass === '1234') {           // yahan apna secret PIN rakho
            const adminModal = document.getElementById('admin-panel');
            if (adminModal) adminModal.style.display = 'block';
        } else {
            alert('Wrong PIN');
        }
    }
});


// Hidden button se admin open (mobile / backup)
const openAdminBtn = document.getElementById('open-admin');
if (openAdminBtn) {
    openAdminBtn.addEventListener('click', function () {
        const adminModal = document.getElementById('admin-panel');
        if (adminModal) {
            adminModal.style.display = 'block';
        }
    });
}

// Admin Form
const adminForm = document.getElementById('admin-form');
if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = parseInt(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const file = document.getElementById('product-image').files[0];

        if (!name || !price || !category || !file) {
            alert('Saare fields + image zaroori hain');
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const newProduct = {
                id: Date.now(),
                name,
                price,
                category,
                img: ev.target.result // Base64
            };
            products.push(newProduct);
            localStorage.setItem('menswear-products', JSON.stringify(products));
            renderProducts();
            adminForm.reset();
            const adminModal = document.getElementById('admin-panel');
            if (adminModal) adminModal.style.display = 'none';
            showSuccess();
        };
        reader.readAsDataURL(file);
    });
}

// Checkout (placeholder)
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        alert('Order placed! Total: ₹' + document.getElementById('cart-total').textContent);
        cart = [];
        localStorage.setItem('menswear-cart', JSON.stringify(cart));
        updateCartCount();
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) cartModal.style.display = 'none';
    });
}

// Fade-up animation for hero / static elements
window.addEventListener('load', () => {
    document.querySelectorAll('.fade-up').forEach(el => {
        setTimeout(() => el.classList.add('show'), 150);
    });
});




// Init (sirf products page pe products div hoga)
loadProducts();
updateCartCount();
