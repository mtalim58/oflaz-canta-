import { auth } from "./firebase.js";
import {
    onAuthStateChanged,
    getIdTokenResult,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace("auth.html");
        return;
    }

    try {
        const token = await getIdTokenResult(user, true);

        if (token.claims.seller !== true) {
            document.body.innerHTML = `
        <main style="font-family: Arial; padding: 40px; text-align: center;">
          <h2>Satici yetkin bulunmuyor.</h2>
          <p>Bu sayfaya yalnizca yetkili saticilar erisebilir.</p>
          <a href="index.html">Ana sayfaya don</a>
        </main>
      `;
            return;
        }

        // Kullanici e-postasini ust menuye yazdir
        const emailSpan = document.getElementById("sellerEmail");
        if (emailSpan) {
            emailSpan.textContent = user.email;
        }

        // Cikis yap butonunu bagla
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                try {
                    await signOut(auth);
                    window.location.replace("auth.html");
                } catch (error) {
                    console.error("Cikis yapilirken hata olustu:", error);
                }
            });
        }

        document.body.style.visibility = "visible";
    } catch (error) {
        console.error("Satici yetkisi kontrol edilemedi:", error);
        window.location.replace("auth.html");
    }
});