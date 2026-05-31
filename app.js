// app.js - Główne zarządzanie stanem aplikacji

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmZuwMuYahF4xQLPK6dxK2o5KJWsZxVTo",
  authDomain: "atomic-hub-ce65c.firebaseapp.com",
  databaseURL: "https://atomic-hub-ce65c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "atomic-hub-ce65c",
  storageBucket: "atomic-hub-ce65c.firebasestorage.app",
  messagingSenderId: "466749870501",
  appId: "1:466749870501:web:d6ce07d9548993a51f184c",
  measurementId: "G-JFNXZ6Z8VQ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Obsługa Disclaimera
    const disclaimer = document.getElementById('disclaimer-overlay');
    const btnAccept = document.getElementById('btn-accept-disclaimer');
    
    if (localStorage.getItem('atomic_disclaimer_accepted') === 'true') {
        disclaimer.style.display = 'none';
    }

    btnAccept.addEventListener('click', () => {
        localStorage.setItem('atomic_disclaimer_accepted', 'true');
        disclaimer.style.display = 'none';
        // Inicjalizacja domyślnego modułu
        switchModule('survival');
    });

    // 2. Przełączanie Modułów
    const modBtns = document.querySelectorAll('.mod-btn');
    modBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetMod = e.target.getAttribute('data-target');
            switchModule(targetMod);
        });
    });

    // 3. Obsługa Globalnego Licznika z Firebase
    const megatonDisplay = document.getElementById('total-megatons');
    const counterRef = ref(db, 'globalStats/totalMegatons');

    // Pobieranie / Nasłuchiwanie na żywo wartości z bazy danych
    onValue(counterRef, (snapshot) => {
        const data = snapshot.val() || 0;
        megatonDisplay.innerText = data.toLocaleString();
        megatonDisplay.classList.add('glow-text');
        setTimeout(() => megatonDisplay.classList.remove('glow-text'), 500);
    });
});

function switchModule(modId) {
    // Update buttons
    document.querySelectorAll('.mod-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.mod-btn[data-target="${modId}"]`).classList.add('active');

    // Update views
    document.querySelectorAll('.app-module').forEach(m => m.classList.remove('active'));
    document.getElementById(`module-${modId}`).classList.add('active');

    // Specyficzna logika modułów po aktywacji
    if(modId === 'war' && typeof initWarRoom === 'function') {
        initWarRoom(); // Inicjuje mapę z opóźnieniem by Leaflet pobrał rozmiar kontenera
    }
}

// Funkcja globalna do dodawania wybuchu (wywoływana z survival.js i war_room.js)
window.addGlobalDetonation = function(megatons) {
    const counterRef = ref(db, 'globalStats/totalMegatons');
    set(counterRef, increment(parseInt(megatons)));
}
