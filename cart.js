
const products = [
    { id: 'skm', name: 'Sate Kambing Muda', price: 50000, category: 'Sate Kambing' },
    { id: 'sas', name: 'Sate Ayam Spesial', price: 35000, category: 'Sate Ayam' },
    { id: 'gk', name: 'Gule Kambing', price: 45000, category: 'Side Dishes' },
    { id: 'sam', name: 'Sate Ayam Madura', price: 32000, category: 'Sate Ayam' },
    { id: 'sabk', name: 'Sate Ayam Bumbu Kecap', price: 30000, category: 'Sate Ayam' },
    { id: 'lt', name: 'Lontong', price: 6000, category: 'Side Dishes' },
    { id: 'np', name: 'Nasi Putih', price: 7000, category: 'Side Dishes' }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const cartBadge = document.querySelector('.shopping-bag-badge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    const cartTotalText = document.querySelector('.cart-total-price');
    if (cartTotalText) {
        cartTotalText.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }

    const cartItemCount = document.querySelector('.cart-item-count');
    if (cartItemCount) {
        cartItemCount.textContent = totalItems;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    
    // Search functionality
    const searchInput = document.getElementById('menu-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.menu-item');
            items.forEach(item => {
                const name = item.dataset.name.toLowerCase();
                if (name.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Hide empty sections
            document.querySelectorAll('.menu-section').forEach(section => {
                const visibleItems = section.querySelectorAll('.menu-item[style="display: flex;"]');
                if (visibleItems.length === 0 && query !== '') {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });
        });
    }

    // Category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update button styles
            categoryBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/20');
                b.classList.add('bg-background-light', 'dark:bg-white/10', 'font-medium');
            });
            btn.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/20');
            btn.classList.remove('bg-background-light', 'dark:bg-white/10', 'font-medium');

            const sections = document.querySelectorAll('.menu-section');
            sections.forEach(section => {
                if (category === 'All' || section.dataset.category === category) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    // Global event listener for add buttons
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (addBtn) {
            addToCart(addBtn.dataset.addToCart);
        }

        const plusBtn = e.target.closest('[data-plus]');
        if (plusBtn) {
            updateQuantity(plusBtn.dataset.plus, 1);
        }

        const minusBtn = e.target.closest('[data-minus]');
        if (minusBtn) {
            updateQuantity(minusBtn.dataset.minus, -1);
        }
    });
});
