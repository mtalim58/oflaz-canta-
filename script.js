// ==========================================
// OFLAZ ÇANTA
// MÜŞTERİ SİTESİ
// SATIŞ + ÜRÜN SİSTEMİ
// ==========================================


// ==========================================
// ÜRÜNLER
// ==========================================

const defaultProducts = [

    {
        id: 1,
        name: "Elegant Omuz Çantası",
        category: "canta",
        price: 1299,
        stock: 15,
        badge: "YENİ",
        image: "images/canta1.jpg",
        description: "Zarif ve modern omuz çantası."
    },

    {
        id: 2,
        name: "Classic Mini Çanta",
        category: "canta",
        price: 999,
        stock: 8,
        badge: "",
        image: "images/canta2.jpg",
        description: "Günlük kullanıma uygun mini çanta."
    },

    {
        id: 3,
        name: "Elegance Siyah Elbise",
        category: "elbise",
        price: 1799,
        stock: 12,
        badge: "YENİ",
        image: "images/elbise1.jpg",
        description: "Özel günler için şık siyah elbise."
    },

    {
        id: 4,
        name: "Soft Touch Elbise",
        category: "elbise",
        price: 1499,
        stock: 5,
        badge: "",
        image: "images/elbise2.jpg",
        description: "Zarif ve rahat elbise."
    }

];


// ==========================================
// ORTAK ÜRÜN VERİSİ
// ==========================================

let productsData =
    JSON.parse(localStorage.getItem("oflazProducts"));


if (!productsData) {

    productsData = defaultProducts;

    saveProducts();

}


function saveProducts() {

    localStorage.setItem(
        "oflazProducts",
        JSON.stringify(productsData)
    );

}


// ==========================================
// ELEMENTLER
// ==========================================

const productsContainer =
    document.getElementById("products");

const cartBtn =
    document.getElementById("cartBtn");

const cartPanel =
    document.getElementById("cart");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");


// ==========================================
// SEPET
// ==========================================

let cartItemsData =
    JSON.parse(localStorage.getItem("oflazCart")) || [];


function saveCart() {

    localStorage.setItem(
        "oflazCart",
        JSON.stringify(cartItemsData)
    );

}


// ==========================================
// ÜRÜNLERİ GÖSTER
// ==========================================

function renderProducts(filter = "all", search = "") {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";


    const searchText =
        search.toLowerCase().trim();


    const filteredProducts =
        productsData.filter(product => {

            const categoryMatch =
                filter === "all" ||
                product.category === filter ||
                (
                    filter === "yeni" &&
                    product.badge === "YENİ"
                );


            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            return categoryMatch && searchMatch;

        });


    if (filteredProducts.length === 0) {

        productsContainer.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align:center;
                padding:60px;
                color:#777;
            ">
                <h3>Ürün bulunamadı.</h3>
                <p>Arama kriterlerini değiştirmeyi deneyin.</p>
            </div>
        `;

        return;

    }


    filteredProducts.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";


        const badgeHTML =
            product.badge
                ? `<span class="badge">${product.badge}</span>`
                : "";


        const imageHTML =
            product.image
                ? `
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                        "
                        onerror="this.style.display='none';
                        this.nextElementSibling.style.display='block';"
                    >
                    <div
                        class="product-placeholder"
                        style="display:none">
                        ${product.category === "canta" ? "👜" : "👗"}
                    </div>
                `
                : `
                    <div class="product-placeholder">
                        ${product.category === "canta" ? "👜" : "👗"}
                    </div>
                `;


        const stockText =
            product.stock > 0
                ? `${product.stock} adet stokta`
                : "Tükendi";


        const disabled =
            product.stock <= 0
                ? "disabled"
                : "";


        card.innerHTML = `

            <div class="product-image">

                ${badgeHTML}

                ${imageHTML}

                <button
                    class="favorite"
                    data-id="${product.id}">
                    ♡
                </button>

            </div>


            <div class="product-info">

                <p>
                    ${product.category === "canta"
                ? "ÇANTA"
                : "ELBİSE"
            }
                </p>

                <h3>
                    ${product.name}
                </h3>

                <div class="price">

                    <strong>
                        ${formatPrice(product.price)}
                    </strong>

                </div>

                <small
                    style="
                        display:block;
                        color:#777;
                        margin-bottom:12px;
                    "
                >
                    ${stockText}
                </small>


                <button
                    class="add-cart"
                    data-id="${product.id}"
                    ${disabled}
                >

                    ${product.stock > 0
                ? "Sepete Ekle"
                : "Tükendi"
            }

                </button>

            </div>

        `;


        productsContainer.appendChild(card);

    });


    activateProductButtons();

}


// ==========================================
// ÜRÜN BUTONLARI
// ==========================================

function activateProductButtons() {


    document
        .querySelectorAll(".add-cart")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id =
                    Number(button.dataset.id);


                const product =
                    productsData.find(
                        item => item.id === id
                    );


                if (!product) return;


                if (product.stock <= 0) {

                    alert("Bu ürün stokta yok.");

                    return;

                }


                const existing =
                    cartItemsData.find(
                        item => item.id === id
                    );


                if (existing) {

                    if (
                        existing.quantity >=
                        product.stock
                    ) {

                        alert(
                            "Stokta bulunan ürün miktarına ulaştınız."
                        );

                        return;

                    }

                    existing.quantity++;

                } else {

                    cartItemsData.push({

                        id: product.id,

                        name: product.name,

                        price: product.price,

                        quantity: 1

                    });

                }


                saveCart();

                updateCart();

                openCart();

            });

        });


    // FAVORİLER

    document
        .querySelectorAll(".favorite")
        .forEach(button => {

            button.addEventListener("click", () => {

                button.classList.toggle("active");

                button.textContent =
                    button.classList.contains("active")
                        ? "♥"
                        : "♡";

            });

        });

}


// ==========================================
// SEPETİ AÇ
// ==========================================

function openCart() {

    cartPanel.classList.add("active");

    cartOverlay.classList.add("active");

}


// ==========================================
// SEPETİ KAPAT
// ==========================================

function closeCartFunction() {

    cartPanel.classList.remove("active");

    cartOverlay.classList.remove("active");

}


cartBtn.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartFunction
);


cartOverlay.addEventListener(
    "click",
    closeCartFunction
);


// ==========================================
// SEPETİ GÜNCELLE
// ==========================================

function updateCart() {

    cartItems.innerHTML = "";


    if (cartItemsData.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Sepetiniz şu anda boş.
            </p>
        `;

    } else {

        cartItemsData.forEach(
            (item, index) => {

                const div =
                    document.createElement("div");

                div.className = "cart-item";


                div.innerHTML = `

                    <div>

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${item.quantity}
                            ×
                            ${formatPrice(item.price)}
                        </p>

                    </div>


                    <button
                        class="remove-item"
                        onclick="removeFromCart(${index})"
                    >
                        ✕
                    </button>

                `;


                cartItems.appendChild(div);

            }
        );

    }


    updateCartCount();

    updateCartTotal();

}


// ==========================================
// SEPETTEN SİL
// ==========================================

function removeFromCart(index) {

    cartItemsData.splice(index, 1);

    saveCart();

    updateCart();

}


// ==========================================
// SEPET SAYISI
// ==========================================

function updateCartCount() {

    const count =
        cartItemsData.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent = count;

}


// ==========================================
// TOPLAM
// ==========================================

function updateCartTotal() {

    const total =
        cartItemsData.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    cartTotal.textContent =
        formatPrice(total);

}


// ==========================================
// SİPARİŞ OLUŞTUR
// ==========================================

document
    .querySelector(".checkout")
    .addEventListener("click", () => {


        if (cartItemsData.length === 0) {

            alert("Sepetiniz boş.");

            return;

        }


        // STOK KONTROLÜ

        for (const cartItem of cartItemsData) {

            const product =
                productsData.find(
                    item => item.id === cartItem.id
                );


            if (!product) {

                alert(
                    `${cartItem.name} artık mevcut değil.`
                );

                return;

            }


            if (
                cartItem.quantity >
                product.stock
            ) {

                alert(
                    `${product.name} için yeterli stok yok.`
                );

                return;

            }

        }


        // STOKLARI AZALT

        cartItemsData.forEach(cartItem => {

            const product =
                productsData.find(
                    item => item.id === cartItem.id
                );


            product.stock -=
                cartItem.quantity;

        });


        saveProducts();


        // TOPLAM HESAPLA

        const total =
            cartItemsData.reduce(
                (sum, item) =>
                    sum +
                    item.price *
                    item.quantity,
                0
            );


        // SİPARİŞ

        const orders =
            JSON.parse(
                localStorage.getItem("oflazOrders")
            ) || [];


        const order = {

            id:
                Date.now(),

            customer:
                "Web Sitesi Müşterisi",

            product:
                cartItemsData
                    .map(
                        item =>
                            `${item.name} (${item.quantity})`
                    )
                    .join(", "),

            total:
                total,

            status:
                "Yeni Sipariş",

            date:
                new Date().toLocaleString("tr-TR")

        };


        orders.push(order);


        localStorage.setItem(
            "oflazOrders",
            JSON.stringify(orders)
        );


        // SEPETİ TEMİZLE

        cartItemsData = [];

        saveCart();

        updateCart();


        renderProducts();


        alert(
            "Siparişiniz başarıyla oluşturuldu! 🎉\n\n" +
            "Sipariş No: #" +
            order.id
        );


        closeCartFunction();

    });


// ==========================================
// FİLTRELER
// ==========================================

const filters =
    document.querySelectorAll(".filter");


filters.forEach(filter => {

    filter.addEventListener(
        "click",
        () => {

            filters.forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


            filter.classList.add(
                "active"
            );


            renderProducts(
                filter.dataset.filter
            );

        }
    );

});


// ==========================================
// ARAMA
// ==========================================

const searchBtn =
    document.getElementById("searchBtn");

const searchBox =
    document.getElementById("searchBox");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");


searchBtn.addEventListener(
    "click",
    () => {

        searchBox.classList.add(
            "active"
        );

        setTimeout(
            () => searchInput.focus(),
            300
        );

    }
);


closeSearch.addEventListener(
    "click",
    () => {

        searchBox.classList.remove(
            "active"
        );

        searchInput.value = "";

        renderProducts();

    }
);


searchInput.addEventListener(
    "input",
    () => {

        const activeFilter =
            document.querySelector(
                ".filter.active"
            );


        renderProducts(
            activeFilter
                ? activeFilter.dataset.filter
                : "all",

            searchInput.value
        );

    }
);


// ==========================================
// MOBİL MENÜ
// ==========================================

const menuBtn =
    document.getElementById("menuBtn");

const mainNav =
    document.getElementById("mainNav");


menuBtn.addEventListener(
    "click",
    () => {

        mainNav.classList.toggle(
            "active"
        );

    }
);


document
    .querySelectorAll("#mainNav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mainNav.classList.remove(
                    "active"
                );

            }
        );

    });


// ==========================================
// FİYAT
// ==========================================

function formatPrice(price) {

    return new Intl.NumberFormat(
        "tr-TR",
        {
            style: "currency",
            currency: "TRY",
            maximumFractionDigits: 0
        }
    ).format(price);

}


// ==========================================
// SATILAN ÜRÜNLER PANELDEN DEĞİŞİRSE
// OTOMATİK YENİLE
// ==========================================

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            "oflazProducts"
        ) {

            productsData =
                JSON.parse(
                    event.newValue
                ) || [];

            renderProducts();

        }


        if (
            event.key ===
            "oflazCart"
        ) {

            cartItemsData =
                JSON.parse(
                    event.newValue
                ) || [];

            updateCart();

        }

    }
);


// ==========================================
// BAŞLANGIÇ
// ==========================================

renderProducts();

updateCart();