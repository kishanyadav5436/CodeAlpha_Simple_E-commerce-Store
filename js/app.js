// ========================================
// ShopVault — E-Commerce Store Logic
// ========================================

const API_URL = 'http://localhost:5000/api';
const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

// State
let products = [];
let cart = JSON.parse(localStorage.getItem('shopvault_cart')) || [];

// DOM
const productsGrid = document.getElementById('products-grid');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartEmptyEl = document.getElementById('cart-empty');
const cartFooter = document.getElementById('cart-footer');
const cartCountEl = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartShipping = document.getElementById('cart-shipping');
const cartTotal = document.getElementById('cart-total');
const btnCheckout = document.getElementById('btn-checkout');
const checkoutModal = document.getElementById('checkout-modal');
const modalCloseBtn = document.getElementById('modal-close');
const toastEl = document.getElementById('toast');
const toastMsg = document.getElementById('toast-message');

// ========== Init ==========
async function init() {
    setupEventListeners();
    await loadProducts('all');
    updateCartUI();
}

function setupEventListeners() {
    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Category filter
    document.querySelectorAll('.nav-link[data-filter]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadProducts(link.dataset.filter);
        });
    });

    btnCheckout.addEventListener('click', handleCheckout);
    modalCloseBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));

    window.addEventListener('scroll', () => {
        document.getElementById('header').classList.toggle('scrolled', window.scrollY > 20);
    });
}

// ========== Products (from API) ==========
async function loadProducts(category) {
    try {
        const query = category && category !== 'all' ? `?category=${category}` : '';
        const res = await fetch(`${API_URL}/products${query}`);
        products = await res.json();
        renderProducts(products);
    } catch (err) {
        // Fallback: try using the local PRODUCTS array if the API is unavailable
        console.warn('API unavailable, using local product data:', err.message);
        if (typeof PRODUCTS !== 'undefined') {
            products = PRODUCTS;
            const filtered = category === 'all' ? products : products.filter(p => p.category === category);
            renderProducts(filtered);
        }
    }
}

function renderProducts(list) {
    productsGrid.innerHTML = '';
    list.forEach((product, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${i * 0.06}s`;
        const id = product._id || product.id;
        const stars = renderStars(product.rating);

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-category">${product.category}</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span>${product.rating}</span>
                    <span class="review-count">(${product.reviews.toLocaleString()})</span>
                </div>
                <div class="product-bottom">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn-add-cart" onclick="addToCart('${id}')">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

function renderStars(rating) {
    let html = '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
    return html;
}

// ========== Cart ==========
function findProduct(productId) {
    return products.find(p => (p._id || p.id) == productId);
}

function addToCart(productId) {
    const product = findProduct(productId);
    if (!product) return;

    const existing = cart.find(item => item.id == productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart`);

    cartCountEl.classList.remove('bump');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bump');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    saveCart();
    updateCartUI();
    renderCartItems();
}

function changeQty(productId, delta) {
    const item = cart.find(i => i.id == productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(productId); return; }
    saveCart();
    updateCartUI();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem('shopvault_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;

    const subtotal = cart.reduce((sum, item) => {
        const product = findProduct(item.id);
        return sum + (product ? product.price * item.qty : 0);
    }, 0);

    const shipping = subtotal > 0 && subtotal < SHIPPING_THRESHOLD ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    cartShipping.textContent = shipping === 0 && subtotal > 0 ? 'FREE' : shipping === 0 ? '$0.00' : `$${shipping.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;

    if (cart.length === 0) {
        cartEmptyEl.classList.remove('hidden');
        cartItemsEl.classList.add('hidden');
        cartFooter.classList.add('hidden');
    } else {
        cartEmptyEl.classList.add('hidden');
        cartItemsEl.classList.remove('hidden');
        cartFooter.classList.remove('hidden');
    }
}

function renderCartItems() {
    cartItemsEl.innerHTML = '';
    cart.forEach(item => {
        const product = findProduct(item.id);
        if (!product) return;
        const id = product._id || product.id;

        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <div class="cart-item-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <span class="cart-item-name">${product.name}</span>
                <span class="cart-item-price">$${(product.price * item.qty).toFixed(2)}</span>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQty('${id}', -1)">−</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${id}', 1)">+</button>
                    <button class="btn-remove" onclick="removeFromCart('${id}')"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        cartItemsEl.appendChild(el);
    });
}

// ========== Cart Open/Close ==========
function openCart() {
    renderCartItems();
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== Checkout (sends order to API) ==========
async function handleCheckout() {
    if (cart.length === 0) return;

    try {
        const orderItems = cart.map(item => ({
            productId: item.id,
            qty: item.qty
        }));

        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: orderItems })
        });

        if (!res.ok) throw new Error('Order failed');

        const order = await res.json();
        console.log('Order created:', order._id);
    } catch (err) {
        console.warn('API checkout unavailable, processing locally:', err.message);
    }

    // Clear cart regardless
    cart = [];
    saveCart();
    updateCartUI();
    closeCart();
    checkoutModal.classList.remove('hidden');
}

// ========== Toast ==========
function showToast(message) {
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// Start
init();
