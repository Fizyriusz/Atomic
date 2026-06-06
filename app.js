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
    const btnShow = document.getElementById('btn-show-disclaimer');
    
    if (localStorage.getItem('atomic_disclaimer_accepted') === 'true') {
        disclaimer.style.display = 'none';
    }

    btnAccept.addEventListener('click', () => {
        localStorage.setItem('atomic_disclaimer_accepted', 'true');
        disclaimer.style.display = 'none';
        // Inicjalizacja domyślnego modułu
        window.switchModule('survival');
    });

    btnShow.addEventListener('click', () => {
        disclaimer.style.display = 'flex';
    });

    // 1b. Obsługa Motywów (Theme System)
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        const savedTheme = localStorage.getItem('atomic_theme') || 'stylized';
        themeSelector.value = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeSelector.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            localStorage.setItem('atomic_theme', newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            if (typeof window.updateMapTheme === 'function') {
                window.updateMapTheme(newTheme);
            }
        });
    }

    // 2. Przełączanie Modułów
    const modBtns = document.querySelectorAll('.mod-btn');
    modBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetMod = e.target.getAttribute('data-target');
            window.switchModule(targetMod);
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

window.switchModule = function(modId) {
    // Update buttons
    document.querySelectorAll('.mod-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.mod-btn[data-target="${modId}"]`);
    if(btn) btn.classList.add('active');

    // Update views
    document.querySelectorAll('.app-module').forEach(m => m.classList.remove('active'));
    const mod = document.getElementById(`module-${modId}`);
    if(mod) mod.classList.add('active');

    // Specyficzna logika modułów po aktywacji
    if(modId === 'war' && typeof initWarRoom === 'function') {
        initWarRoom(); // Inicjuje mapę z opóźnieniem by Leaflet pobrał rozmiar kontenera
    }
    
    // Przebudowa wykresów dla ukrytych kontenerów
    if (modId === 'arsenal' && typeof updateArsenalApp === 'function') {
        setTimeout(updateArsenalApp, 100);
    }
}

// Funkcja globalna do dodawania wybuchu (wywoływana z survival.js i war_room.js)
window.addGlobalDetonation = function(megatons) {
    const counterRef = ref(db, 'globalStats/totalMegatons');
    set(counterRef, increment(parseInt(megatons)));
}
