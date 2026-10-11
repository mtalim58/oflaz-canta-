// ==========================================
// OFLAZ ÇANTA - SATICI PANELİ
// ==========================================


// ==========================================
// ÖRNEK ÜRÜNLER
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
// LOCAL STORAGE
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
// SAYFA DEĞİŞTİRME
// ==========================================

const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");


const pageNames = {

    dashboard: "Dashboard",
    products: "Ürünler",
    orders: "Siparişler",
    addProduct: "Ürün Ekle"

};


menuItems.forEach(button => {

    button.addEventListener("click", () => {

        const page = button.dataset.page;

        showPage(page);

    });

});


function showPage(page) {

    pages.forEach(item => {

        item.classList.remove("active");

    });


    menuItems.forEach(item => {

        item.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(page);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    const selectedMenu =
        document.querySelector(
            `.menu-item[data-page="${page}"]`
        );

    if (selectedMenu) {

        selectedMenu.classList.add("active");

    }


    pageTitle.textContent =
        pageNames[page] || "Dashboard";


    if (page === "products") {

        renderProducts();

    }


    if (page === "dashboard") {

        updateDashboard();

    }


    if (page === "orders") {

        renderOrders();

    }

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    document.getElementById("totalProducts")
        .textContent = productsData.length;


    const totalStock =
        productsData.reduce(
            (total, product) =>
                total + Number(product.stock),
            0
        );

    document.getElementById("totalStock")
        .textContent = totalStock;


    const orders =
        getOrders();

    document.getElementById("totalOrders")
        .textContent = orders.length;


    const sales =
        orders.reduce(
            (total, order) =>
                total + Number(order.total),
            0
        );


    document.getElementById("totalSales")
        .textContent = formatPrice(sales);


    renderRecentOrders();

}


// ==========================================
// ÜRÜNLERİ GÖSTER
// ==========================================

function renderProducts() {

    const table =
        document.getElementById("productTable");

    const search =
        document.getElementById("productSearch")
            .value
            .toLowerCase();


    const category =
        document.getElementById("categorySearch")
            .value;


    table.innerHTML = "";


    const filtered =
        productsData.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all" ||
                product.category === category;


            return matchesSearch &&
                matchesCategory;

        });


    filtered.forEach(product => {

        const row =
            document.createElement("tr");


        let stockClass = "stock-good";

        if (product.stock <= 5) {

            stockClass = "stock-low";

        }

        if (product.stock <= 0) {

            stockClass = "stock-none";

        }


        const status =
            product.stock > 0
                ? `<span class="status status-active">Aktif</span>`
                : `<span class="status status-passive">Tükendi</span>`;


        row.innerHTML = `

            <td>
                <div class="product-name">
                    ${product.name}
                </div>
            </td>

            <td>
                <span class="category">
                    ${product.category === "canta"
                ? "Çanta"
                : "Elbise"
            }
                </span>
            </td>

            <td>
                ${formatPrice(product.price)}
            </td>

            <td>
                <span class="${stockClass}">
                    ${product.stock}
                </span>
            </td>

            <td>
                ${status}
            </td>

            <td>

                <div class="table-buttons">

                    <button
                        class="edit-btn"
                        onclick="openEditModal(${product.id})">
                        Düzenle
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})">
                        Sil
                    </button>

                </div>

            </td>
        `;


        table.appendChild(row);

    });

}


// ==========================================
// ÜRÜN ARAMA
// ==========================================

document
    .getElementById("productSearch")
    .addEventListener("input", renderProducts);


document
    .getElementById("categorySearch")
    .addEventListener("change", renderProducts);


// ==========================================
// ÜRÜN EKLE
// ==========================================

document
    .getElementById("productForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const newProduct = {

            id: Date.now(),

            name:
                document.getElementById("productName")
                    .value,

            category:
                document.getElementById("productCategory")
                    .value,

            price:
                Number(
                    document.getElementById("productPrice")
                        .value
                ),

            stock:
                Number(
                    document.getElementById("productStock")
                        .value
                ),

            badge:
                document.getElementById("productBadge")
                    .value,

            description:
                document.getElementById("productDescription")
                    .value,

            image:
                document.getElementById("productImage")
                    .value

        };


        productsData.push(newProduct);

        saveProducts();


        alert("Ürün başarıyla eklendi!");


        this.reset();


        showPage("products");

    });


// ==========================================
// ÜRÜN SİL
// ==========================================

function deleteProduct(id) {

    const product =
        productsData.find(
            item => item.id === id
        );


    if (!product) return;


    const confirmDelete =
        confirm(
            `"${product.name}" ürününü silmek istediğine emin misin?`
        );


    if (!confirmDelete) return;


    productsData =
        productsData.filter(
            item => item.id !== id
        );


    saveProducts();

    renderProducts();

    updateDashboard();

}


// ==========================================
// ÜRÜN DÜZENLE
// ==========================================

function openEditModal(id) {

    const product =
        productsData.find(
            item => item.id === id
        );


    if (!product) return;


    document.getElementById("editId")
        .value = product.id;


    document.getElementById("editName")
        .value = product.name;


    document.getElementById("editPrice")
        .value = product.price;


    document.getElementById("editStock")
        .value = product.stock;


    document
        .getElementById("editModal")
        .classList.add("active");

}


function closeEditModal() {

    document
        .getElementById("editModal")
        .classList.remove("active");

}


function saveEdit() {

    const id =
        Number(
            document.getElementById("editId")
                .value
        );


    const product =
        productsData.find(
            item => item.id === id
        );


    if (!product) return;


    product.name =
        document.getElementById("editName")
            .value;


    product.price =
        Number(
            document.getElementById("editPrice")
                .value
        );


    product.stock =
        Number(
            document.getElementById("editStock")
                .value
        );


    saveProducts();

    closeEditModal();

    renderProducts();

    updateDashboard();


    alert("Ürün güncellendi.");

}


// ==========================================
// SİPARİŞLER
// ==========================================

function getOrders() {

    return JSON.parse(
        localStorage.getItem("oflazOrders")
    ) || [];

}


function renderOrders() {

    const orders =
        getOrders();


    const table =
        document.getElementById("ordersTable");


    table.innerHTML = "";


    if (orders.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5"
                    style="text-align:center;color:#888;padding:40px">

                    Henüz sipariş bulunmuyor.

                </td>

            </tr>

        `;

        return;

    }


    orders.forEach(order => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                #${order.id}
            </td>

            <td>
                ${order.customer || "Müşteri"}
            </td>

            <td>
                ${order.product || "Ürün"}
            </td>

            <td>
                ${formatPrice(order.total)}
            </td>

            <td>
                <span class="status status-active">
                    ${order.status || "Hazırlanıyor"}
                </span>
            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// SON SİPARİŞLER
// ==========================================

function renderRecentOrders() {

    const container =
        document.getElementById("recentOrders");


    const orders =
        getOrders();


    if (orders.length === 0) {

        container.innerHTML = `
            <p style="color:#888;font-size:12px">
                Henüz sipariş bulunmuyor.
            </p>
        `;

        return;

    }


    container.innerHTML = "";


    orders.slice(-5).reverse().forEach(order => {

        const div =
            document.createElement("div");


        div.className = "order-row";


        div.innerHTML = `

            <div class="order-info">

                <strong>
                    #${order.id}
                </strong>

                <span>
                    ${order.customer || "Müşteri"}
                </span>

            </div>

            <div class="order-price">

                ${formatPrice(order.total)}

            </div>

        `;


        container.appendChild(div);

    });

}


// ==========================================
// PARA BİÇİMİ
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
// MOBİL MENÜ
// ==========================================

document
    .getElementById("mobileMenu")
    .addEventListener("click", () => {

        document
            .querySelector(".sidebar")
            .classList.toggle("active");

    });


// ==========================================
// BAŞLANGIÇ
// ==========================================

updateDashboard();

renderProducts();