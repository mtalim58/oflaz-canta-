
import { auth, db } from "../firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const message = document.getElementById("message");

function showMessage(text) {
  message.textContent = text;
}

function showForm(type) {
  const isLogin = type === "login";

  loginForm.hidden = !isLogin;
  registerForm.hidden = isLogin;
  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);
  showMessage("");
}

loginTab.addEventListener("click", () => showForm("login"));
registerTab.addEventListener("click", () => showForm("register"));

function readableError(error) {
  const errors = {
    "auth/invalid-email": "E-posta adresini kontrol et.",
    "auth/user-not-found": "Bu e-postayla kayıtlı hesap bulunamadı.",
    "auth/invalid-credential": "E-posta veya şifre hatalı.",
    "auth/email-already-in-use": "Bu e-posta zaten kayıtlı.",
    "auth/weak-password": "Daha güçlü bir şifre seç.",
    "auth/too-many-requests": "Çok fazla deneme yapıldı. Biraz sonra tekrar dene.",
    "auth/network-request-failed": "Bağlantını kontrol edip tekrar dene."
  };

  return errors[error.code] || "İşlem yapılamadı. Bilgileri kontrol edip tekrar dene.";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = loginForm.querySelector(".submit");
  button.disabled = true;
  showMessage("Giriş yapılıyor...");

  try {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "hesabim.html";
  } catch (error) {
    showMessage(readableError(error));
  } finally {
    button.disabled = false;
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = registerForm.querySelector(".submit");
  button.disabled = true;
  showMessage("Hesabın oluşturuluyor...");

  let createdUser = null;

  try {
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (name.length < 2) {
      showMessage("Lütfen adını ve soyadını gir.");
      return;
    }

    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    createdUser = credential.user;

    await updateProfile(createdUser, {
      displayName: name
    });

    await setDoc(doc(db, "users", createdUser.uid), {
      name,
      email: createdUser.email,
      createdAt: serverTimestamp()
    });

    window.location.href = "hesabim.html";
  } catch (error) {
    if (createdUser) {
      showMessage(
        "Hesabın oluşturuldu ancak profil kaydı tamamlanamadı. " +
        "Tekrar giriş yapıp destek al."
      );
    } else {
      showMessage(readableError(error));
    }
  } finally {
    button.disabled = false;
  }
});

document.getElementById("forgotPassword").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim();

  if (!email) {
    showMessage("Önce e-posta adresini gir.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage("Uygunsa şifre sıfırlama e-postası gönderildi.");
  } catch (error) {
    showMessage(readableError(error));
  }
});

// Oturum açıksa giriş sayfasında kalmak zorunda değilsin.
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Kullanıcı giriş sayfasını tekrar açtıysa hesabına yönlendir.
    window.location.replace("hesabim.html");
  }
});
