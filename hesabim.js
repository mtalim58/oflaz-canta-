
import { auth, db } from "../firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const welcome = document.getElementById("welcome");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const ordersList = document.getElementById("ordersList");
const accountMessage = document.getElementById("accountMessage");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("auth.html");
    return;
  }

  welcome.textContent = `Hoş geldin, ${user.displayName || "müşterimiz"}!`;
  profileEmail.textContent = user.email || "—";

  try {
    const profileRef = doc(db, "users", user.uid);
    const profileSnapshot = await getDoc(profileRef);



    const savedName = profileSnapshot.exists()
      ? (profileSnapshot.data().name || "")
      : "";

    const displayName = user.displayName || "";

    profileName.textContent =
      savedName || displayName || "İsim henüz kaydedilmemiş";

    welcome.textContent =
      `Hoş geldin, ${savedName || displayName || "müşterimiz"}!`;


    // Sadece bu müşterinin siparişlerini sorgula.
    const ordersQuery = query(
      collection(db, "orders"),
      where("customerUid", "==", user.uid)
    );

    const snapshot = await getDocs(ordersQuery);

    ordersList.replaceChildren();

    if (snapshot.empty) {
      ordersList.textContent = "Henüz siparişin bulunmuyor.";
      return;
    }

    snapshot.forEach((orderDoc) => {
      const order = orderDoc.data();
      const item = document.createElement("article");
      item.className = "order-item";

      const title = document.createElement("strong");
      title.textContent = `Sipariş #${orderDoc.id}`;

      const details = document.createElement("p");
      details.textContent = order.product || "Sipariş detayı mevcut değil.";

      const total = document.createElement("p");
      const amount = Number(order.total);
      total.textContent = Number.isFinite(amount)
        ? `Toplam: ${new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
          maximumFractionDigits: 2
        }).format(amount)}`
        : "Toplam: —";

      const status = document.createElement("p");
      status.className = "order-status";
      status.textContent = `Durum: ${order.status || "Alındı"}`;

      item.append(title, details, total, status);
      ordersList.append(item);
    });
  } catch (error) {
    console.error(error);
    ordersList.textContent =
      "Bilgiler yüklenemedi. Firebase güvenlik kurallarını kontrol et.";
  }
});

document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.replace("index.html");
  } catch (error) {
    console.error(error);
    accountMessage.textContent = "Çıkış yapılamadı. Tekrar dene.";
  }
});
