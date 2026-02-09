
const products = [
    { id: 'skn', name: 'Sate kambing+nasi+minum', price: 25000, category: 'Sate Kambing' },
    { id: 'tkk', name: 'Tongseng kepala kambing', price: 23000, category: 'Side Dishes' },
    { id: 'tk', name: 'Tongseng kambing', price: 23000, category: 'Side Dishes' },
    { id: 'tgg', name: 'Tengkleng gongso', price: 23000, category: 'Side Dishes' },
    { id: 'tkq', name: 'Tengkleng kuah', price: 23000, category: 'Side Dishes' },
    { id: 'glk', name: 'Gulai kambing', price: 18000, category: 'Side Dishes' },
    { id: 'rct', name: 'Rica-rica tengkleng', price: 20000, category: 'Side Dishes' },
    { id: 'kku', name: 'Kepala kambing utuh', price: 100000, category: 'Side Dishes' },
    { id: 'spa', name: 'SOP ayam', price: 15000, category: 'Side Dishes' },
    { id: 'sis', name: 'SOP iga sapi', price: 25000, category: 'Side Dishes' },
    { id: 'isb', name: 'Iga sapi bakar', price: 25000, category: 'Side Dishes' },
    { id: 'agb', name: 'Ayam goreng/bakar', price: 20000, category: 'Side Dishes' },
    { id: 'bgb', name: 'Bebek goreng/bakar', price: 25000, category: 'Side Dishes' },
    { id: 'ngb', name: 'Nila goreng/bakar', price: 18000, category: 'Side Dishes' },
    { id: 'lgb', name: 'Lele goreng/bakar', price: 10000, category: 'Side Dishes' },
    { id: 'kbe', name: 'Kepala bebek', price: 10000, category: 'Side Dishes' },
    { id: 'kab', name: 'Kepala + ati bebek', price: 15000, category: 'Side Dishes' },
    { id: 'nss', name: 'Nasi saja', price: 3000, category: 'Side Dishes' },
    { id: 'teh', name: 'Teh es/panas', price: 3000, category: 'Drinks' },
    { id: 'jer', name: 'Jeruk es/panas', price: 3000, category: 'Drinks' },
    { id: 'tkp', name: 'Teh kampol es/panas', price: 4000, category: 'Drinks' },
    { id: 'lmt', name: 'Lemontea es/panas', price: 4000, category: 'Drinks' },
    { id: 'sus', name: 'Susu putih/coklat es/panas', price: 4000, category: 'Drinks' },
    { id: 'sja', name: 'Susu jahe', price: 6000, category: 'Drinks' },
    { id: 'amb', name: 'Air mineral botol', price: 4000, category: 'Drinks' },
    { id: 'aes', name: 'Air es', price: 2000, category: 'Drinks' }
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
