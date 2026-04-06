// ========== ТОВАРЫ ==========
const products = [
    { id:1, name:"Дракон", price:1290, desc:"Модель с подвижными крыльями, чешуя проработана вручную. Размер 12 см.", img:"🐉", category:"животные", details:"PLA пластик, время печати 6 часов" },
    { id:2, name:"Котик-самурай", price:890, desc:"Милота с мечом катаной и шлемом. Высота 8 см.", img:"🐱", category:"аниме", details:"Печать из PETG, можно использовать как брелок" },
    { id:3, name:"Сова-маг", price:1140, desc:"В шляпе и с посохом, светящиеся глаза (светонакопитель).", img:"🦉", category:"фэнтези", details:"Фотополимерная смола, детализация 0.05 мм" },
    { id:4, name:"Робот-пылесос", price:750, desc:"Смешные глаза-колёса, вращается.", img:"🤖", category:"техника", details:"Нейлон, подвижные элементы" },
    { id:5, name:"Ёжик в тумане", price:990, desc:"С узелком и лапками. Очень атмосферно.", img:"🦔", category:"животные", details:"PLA + матовая покраска" },
    { id:6, name:"Мандалорец", price:2100, desc:"Детальная броня, шлем снимается. Высота 15 см.", img:"🪖", category:"кино", details:"Печать смолой, ручная роспись" },
    { id:7, name:"Печать по STL", price:500, desc:"Ваша модель. Цена за 10 г пластика.", img:"🖨️", category:"услуга", details:"Пришлите файл — оценим за 1 час" },
    { id:8, name:"Бэтмен", price:1850, desc:"Плащ, мускулатура, подставка.", img:"🦇", category:"кино", details:"PETG + чёрный матовый" },
    { id:9, name:"Лиса-космонавт", price:1240, desc:"В скафандре, наш бестселлер.", img:"🦊", category:"фэнтези", details:"Высота 11 см, постамент-планета" },
    { id:10, name:"Гриб-дом", price:670, desc:"Маленький домик для настолок.", img:"🍄", category:"интерьер", details:"Можно покрасить самим" },
    { id:11, name:"Чеширский кот", price:1530, desc:"Улыбка светится в темноте.", img:"🐈", category:"кино", details:"Смола + люминофор" },
    { id:12, name:"Меч-ручка", price:430, desc:"Ручка в виде меча, пишет.", img:"⚔️", category:"полезное", details:"PETG, стержень входит в комплект" },
    { id:13, name:"Подставка под телефон", price:390, desc:"Дракон держит телефон.", img:"📱", category:"полезное", details:"PLA, любой цвет" },
    { id:14, name:"Скелет динозавра", price:2990, desc:"18 костей, собирается.", img:"🦖", category:"конструктор", details:"Печать нейлоном, инструкция" }
];

// ========== КОРЗИНА И ИЗБРАННОЕ ==========
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveCart() { 
    localStorage.setItem("cart", JSON.stringify(cart)); 
    updateCartCount(); 
}
function saveFav() { 
    localStorage.setItem("favorites", JSON.stringify(favorites)); 
}
function updateCartCount() {
    let total = cart.reduce((s,i) => s + i.qty, 0);
    document.querySelectorAll("#cartCount").forEach(el => el.innerText = total);
}
function addToCart(id) {
    let item = cart.find(i => i.id === id);
    if(item) item.qty++;
    else cart.push({ id, qty: 1 });
    saveCart();
    alert("✅ Добавлено в корзину");
}
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    if(window.location.pathname.includes("cart.html")) renderCart();
}
function toggleFav(id) {
    if(favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    saveFav();
    if(window.location.pathname.includes("catalog.html")) renderCatalog();
    if(window.location.pathname.includes("favorites.html")) renderFavorites();
}

// ========== ОТРИСОВКА СТРАНИЦ ==========
function renderCatalog() {
    let grid = document.getElementById("catalogGrid");
    if(!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="location.href='product.html?id=${p.id}'">
            <div style="font-size:4rem">${p.img}</div>
            <h3>${p.name}</h3>
            <div class="price">${p.price} ₽</div>
            <p style="font-size:0.8rem; margin:8px 0">${p.desc.substring(0,70)}...</p>
            <button class="add-to-cart" data-id="${p.id}" onclick="event.stopPropagation();addToCart(${p.id})">🛒 В корзину</button>
            <button onclick="event.stopPropagation();toggleFav(${p.id})">${favorites.includes(p.id) ? '❤️' : '🤍'}</button>
        </div>
    `).join("");
}

function renderCart() {
    let container = document.getElementById("cartItems");
    if(!container) return;
    if(cart.length === 0) {
        container.innerHTML = "<p style='text-align:center;padding:2rem'>🛒 Корзина пуста</p>";
        document.getElementById("cartTotal").innerHTML = "";
        return;
    }
    let itemsHtml = cart.map(c => {
        let p = products.find(pr => pr.id === c.id);
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-emoji">${p.img}</span>
                    <span class="cart-item-name">${p.name}</span>
                    <span class="cart-item-price">${p.price} ₽ × ${c.qty}</span>
                </div>
                <div>
                    <strong>${p.price * c.qty} ₽</strong>
                    <button class="cart-item-remove" onclick="removeFromCart(${p.id})">🗑️ Удалить</button>
                </div>
            </div>
        `;
    }).join("");
    container.innerHTML = itemsHtml;
    let total = cart.reduce((s,c) => s + (products.find(p => p.id === c.id).price * c.qty), 0);
    document.getElementById("cartTotal").innerHTML = `<div class="cart-total">Итого: ${total} ₽</div>`;
}

function renderFavorites() {
    let grid = document.getElementById("favoritesGrid");
    if(!grid) return;
    let favProds = products.filter(p => favorites.includes(p.id));
    if(favProds.length === 0) {
        grid.innerHTML = "<p style='text-align:center;padding:2rem'>❤️ Нет избранных товаров</p>";
        return;
    }
    grid.innerHTML = favProds.map(p => `
        <div class="product-card" onclick="location.href='product.html?id=${p.id}'">
            <div style="font-size:4rem">${p.img}</div>
            <h3>${p.name}</h3>
            <div class="price">${p.price} ₽</div>
            <p style="font-size:0.8rem">${p.desc.substring(0,60)}...</p>
            <button onclick="event.stopPropagation();toggleFav(${p.id})">🗑️ Удалить</button>
        </div>
    `).join("");
}

function renderProductPage() {
    let params = new URLSearchParams(location.search);
    let id = parseInt(params.get("id"));
    let p = products.find(pr => pr.id === id);
    if(!p) return;
    let container = document.getElementById("productPage");
    if(container) {
        container.innerHTML = `
            <div style="max-width:600px;margin:0 auto;text-align:center">
                <div style="font-size:6rem">${p.img}</div>
                <h1>${p.name}</h1>
                <p style="font-size:1.1rem; margin:1rem 0">${p.desc}</p>
                <p style="color:#9b7b64"><strong>${p.details || "Детали уточняйте у мастера"}</strong></p>
                <div style="font-size:2rem; margin:1rem 0">${p.price} ₽</div>
                <button class="btn-primary" onclick="addToCart(${p.id})">🛒 Добавить в корзину</button>
            </div>
        `;
    }
    let bc = document.getElementById("productBreadcrumbs");
    if(bc) {
        bc.innerHTML = `<a href="index.html">Главная</a> <span>/</span> <a href="catalog.html">Каталог</a> <span>/</span> <span>${p.name}</span>
        <button class="back-btn" onclick="history.back()">← Назад</button>`;
    }
}

// ========== ТЁМНАЯ ТЕМА ==========
if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
document.getElementById("themeToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// ========== КНОПКА НАВЕРХ ==========
window.addEventListener("scroll", () => {
    let btn = document.getElementById("goTop");
    if(btn) btn.style.display = window.scrollY > 300 ? "block" : "none";
});
document.getElementById("goTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ========== ФОРМА ОБРАТНОЙ СВЯЗИ ==========
document.getElementById("feedbackForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    let msg = document.getElementById("formMessage");
    if(msg) {
        msg.innerText = "✅ Спасибо! Мастер свяжется с вами.";
        msg.style.color = "#9b7b64";
    }
    e.target.reset();
});

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if(cart.length === 0) alert("Корзина пуста");
    else alert("🎉 Заказ оформлен! С вами свяжется менеджер.");
});

// ========== FAQ АККОРДЕОН ==========
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        q.parentElement.classList.toggle('open');
    });
});

// ========== ЗАПУСК ==========
updateCartCount();
renderCatalog();
renderCart();
renderFavorites();
renderProductPage();