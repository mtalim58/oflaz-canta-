import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    getIdTokenResult
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
          <h2>Satıcı yetkin bulunmuyor.</h2>
          <p>Bu sayfaya yalnızca yetkili satıcılar erişebilir.</p>
          <a href="index.html">Ana sayfaya dön</a>
        </main>
      `;
            return;
        }

        document.body.style.visibility = "visible";
    } catch (error) {
        console.error("Satıcı yetkisi kontrol edilemedi:", error);
        window.location.replace("auth.html");
    }
});