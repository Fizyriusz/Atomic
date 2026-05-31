// war_room.js - Moduł 2: War Room (Pełna mapa taktyczna)

let map;
let darkLayer, satLayer;
let warBase = null;
let warTarget = null;
let activeLayers = [];
let isWarRoomInitialized = false;

window.initWarRoom = function() {
    if(isWarRoomInitialized) {
        map.invalidateSize(); // Wymuś odrysowanie, jeśli kontener zmienił rozmiar
        return;
    }
    
    setTimeout(() => {
        map = L.map('map-container', { zoomControl: false, attributionControl: false }).setView([52, 20], 5);
        darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

        map.on('click', handleMapClick);
        isWarRoomInitialized = true;
    }, 100);
}

let selectionMode = 'target'; // 'base' lub 'target'

window.setWarMode = function(mode) {
    selectionMode = mode;
    logWarMsg(`TRYB WYBORU: ${mode === 'base' ? 'BAZA' : 'CEL'}`);
}

function handleMapClick(e) {
    const latlng = e.latlng;
    
    if(selectionMode === 'base') {
        if(warBase) map.removeLayer(warBase.marker);
        const m = L.marker(latlng, { icon: L.divIcon({ className:'', html:'<div style="color:var(--blue); font-size:24px; text-shadow:0 0 10px var(--blue);">⚓</div>' }) }).addTo(map);
        warBase = { latlng, marker: m };
        selectionMode = 'target';
    } else {
        if(warTarget) map.removeLayer(warTarget.marker);
        const m = L.marker(latlng, { icon: L.divIcon({ className:'', html:'<div style="color:var(--red); font-size:24px; text-shadow:0 0 10px var(--red);">🎯</div>' }) }).addTo(map);
        warTarget = { latlng, marker: m };
    }
    updateWarStats();
}

function updateWarStats() {
    if(warBase && warTarget) {
        const dist = (map.distance(warBase.latlng, warTarget.latlng) / 1000).toFixed(0);
        // Prędkość zależy od nośnika
        const carrier = document.querySelector('.triad-btn.active').dataset.type;
        let speedKmh = 24000; // default ICBM
        if(carrier === 'bomber') speedKmh = 1000;
        if(carrier === 'sub') speedKmh = 5000; // SLBM
        
        const timeMin = (dist / (speedKmh / 60)).toFixed(1);
        
        document.getElementById('war-stats').innerHTML = `
            DYSTANS: <span class="glow-text">${dist} KM</span><br>
            ETA: <span class="glow-text">${timeMin} MIN</span>
        `;
        document.getElementById('btn-war-launch').disabled = false;
    }
}

window.selectCarrier = function(btn) {
    document.querySelectorAll('.triad-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateWarStats();
}

window.launchWarAction = async function() {
    if(!warBase || !warTarget) return;
    
    const yieldKt = parseFloat(document.getElementById('war-yield').value);
    document.getElementById('btn-war-launch').disabled = true;
    logWarMsg("INICJUJĘ ODPALENIE...");
    
    await animateMissile(warBase.latlng, warTarget.latlng, { kt: yieldKt });
}

function animateMissile(start, end, data) {
    return new Promise(res => {
        const sP = map.latLngToContainerPoint(start);
        const eP = map.latLngToContainerPoint(end);
        
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '10px'; div.style.height = '10px';
        div.style.background = 'var(--red)';
        div.style.borderRadius = '50%';
        div.style.boxShadow = '0 0 15px var(--red)';
        div.style.zIndex = '3000';
        div.style.left = sP.x + 'px'; div.style.top = sP.y + 'px';
        div.style.pointerEvents = 'none';
        document.getElementById('map-container').appendChild(div);

        const startTime = performance.now();
        const carrier = document.querySelector('.triad-btn.active').dataset.type;
        let duration = 1500; // ICBM
        if(carrier === 'bomber') duration = 4000;
        if(carrier === 'sub') duration = 1000;

        function step(now) {
            const progress = (now - startTime) / duration;
            if(progress < 1) {
                const curX = sP.x + (eP.x - sP.x) * progress;
                // Wybrzuszenie paraboli
                const arcY = Math.sin(progress * Math.PI) * 150; 
                const curY = sP.y + (eP.y - sP.y) * progress - arcY;
                
                div.style.left = curX + 'px';
                div.style.top = curY + 'px';
                
                // Odświeżanie przeliczenia pikseli na wypadek zoomowania mapy w trakcie
                // Upraszczamy tutaj i nie robimy tego w każdej klatce dla wydajności
                
                requestAnimationFrame(step);
            } else {
                if(div.parentNode) div.parentNode.removeChild(div);
                detonate(end, data);
                res();
            }
        }
        requestAnimationFrame(step);
    });
}

function detonate(latlng, data) {
    const mapEl = document.getElementById('map-container');
    mapEl.style.filter = "brightness(10) sepia(1) hue-rotate(-50deg)";
    setTimeout(() => mapEl.style.filter = "none", 300);
    
    const sB = Math.pow(data.kt, 1/3);
    const zones = [
        { r: sB * 3300, col: '#555', label: 'Podmuch' },
        { r: sB * 1100, col: '#ff2a2a', label: 'Zniszczenia' },
        { r: sB * 150, col: '#ffff00', label: 'Kula ognia' }
    ];

    zones.forEach(z => {
        const c = L.circle(latlng, { radius: z.r, color: z.col, fillOpacity: 0.3 }).addTo(map);
        activeLayers.push(c);
    });
    
    logWarMsg(`UDERZENIE POTWIERDZONE: ${data.kt}KT`);
    document.getElementById('btn-war-launch').disabled = false;
    
    // Dodaj do globalnego licznika
    let megatons = data.kt >= 1000 ? (data.kt / 1000) : 1;
    if(window.addGlobalDetonation) window.addGlobalDetonation(megatons);
}

window.clearWarMap = function() {
    activeLayers.forEach(l => map.removeLayer(l));
    if(warBase) map.removeLayer(warBase.marker);
    if(warTarget) map.removeLayer(warTarget.marker);
    activeLayers = []; warBase = null; warTarget = null;
    document.getElementById('btn-war-launch').disabled = true;
    document.getElementById('war-stats').innerHTML = "";
    logWarMsg("CZYSTKA MAPY.");
}

function logWarMsg(msg) {
    const box = document.getElementById('war-log');
    box.innerHTML = `> ${msg}<br>` + box.innerHTML;
}
