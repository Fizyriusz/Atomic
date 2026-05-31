// war_room.js - Moduł 2: War Room (Pełna mapa taktyczna i strategiczna)

let map;
let darkLayer, satLayer;
let warBase = null;
let warTarget = null;
let activeLayers = [];
let patriotBatteries = []; // { latlng, marker, circle }
let isWarRoomInitialized = false;
let selectionMode = 'base'; // 'base' lub 'target'
let activeCarrier = 'icbm';

window.initWarRoom = function() {
    if(isWarRoomInitialized) {
        map.invalidateSize();
        return;
    }
    
    setTimeout(() => {
        map = L.map('map-container', { zoomControl: false, attributionControl: false }).setView([30, 0], 2);
        darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');

        map.on('click', handleMapClick);
        isWarRoomInitialized = true;
        logWarMsg("SYSTEM WDS INICJOWANY...");
    }, 100);
}

window.setWarMode = function(mode) {
    if (activeCarrier === 'patriot' && mode === 'target') {
        logWarMsg("BŁĄD: SYSTEM DEFENSYWNY PATRIOT NIE WYMAGA CELU.");
        return;
    }
    selectionMode = mode;
    logWarMsg(`TRYB WYBORU: ${mode === 'base' ? 'START / TARCZA' : 'CEL ATAKU'}`);
}

function handleMapClick(e) {
    const latlng = e.latlng;
    
    if (activeCarrier === 'patriot') {
        // Tarcza Patriot - stawiamy baterię obronną
        const batteryIcon = L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' });
        const marker = L.marker(latlng, { icon: batteryIcon }).addTo(map);
        
        // Zasięg tarczy (np. 800 km)
        const radiusMeters = 800 * 1000;
        const circle = L.circle(latlng, {
            radius: radiusMeters,
            color: 'var(--blue)',
            weight: 1,
            dashArray: '3, 5',
            fillOpacity: 0.05
        }).addTo(map);
        
        patriotBatteries.push({ latlng, marker, circle });
        activeLayers.push(marker, circle);
        
        logWarMsg(`ZAINSTALOWANO BATERIĘ PATRIOT. ZASIĘG OBRONY: 800 KM.`);
    } else {
        // Logika standardowa (Silos / Sub / Bomber)
        if(selectionMode === 'base') {
            if(warBase) map.removeLayer(warBase.marker);
            let iconHtml = '🏢'; // Silos
            if (activeCarrier === 'sub') iconHtml = '⚓';
            if (activeCarrier === 'bomber') iconHtml = '✈️';
            
            const m = L.marker(latlng, { icon: L.divIcon({ className:'', html:`<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">${iconHtml}</div>` }) }).addTo(map);
            warBase = { latlng, marker: m };
            selectionMode = 'target';
            logWarMsg("USTAWIONO POZYCJĘ STARTOWĄ. WYBIERZ CEL.");
        } else {
            if(warTarget) map.removeLayer(warTarget.marker);
            const m = L.marker(latlng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">🎯</div>' }) }).addTo(map);
            warTarget = { latlng, marker: m };
            logWarMsg("USTAWIONO CEL. GOTÓW DO STRZAŁU.");
        }
        updateWarStats();
    }
}

function updateWarStats() {
    if(warBase && warTarget) {
        const dist = (map.distance(warBase.latlng, warTarget.latlng) / 1000).toFixed(0);
        let speedKmh = 24000; // ICBM
        if(activeCarrier === 'bomber') speedKmh = 1000;
        if(activeCarrier === 'sub') speedKmh = 8000; // SLBM
        
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
    activeCarrier = btn.dataset.type;
    
    // Konfiguracja widoku pod wybrany typ uzbrojenia
    if (activeCarrier === 'patriot') {
        document.getElementById('btn-war-target').disabled = true;
        document.getElementById('btn-war-launch').disabled = true;
        logWarMsg("TRYB OBRONY: KLIKNIJ NA MAPIE ABY UMIEŚCIĆ BATERIĘ PATRIOT.");
    } else {
        document.getElementById('btn-war-target').disabled = false;
        if (warBase && warTarget) {
            document.getElementById('btn-war-launch').disabled = false;
        }
        logWarMsg(`TRYB ATAKU: ${activeCarrier.toUpperCase()}. WYBIERZ BAZĘ I CEL.`);
    }
    updateWarStats();
}

window.launchWarAction = async function() {
    if(!warBase || !warTarget) return;
    
    const yieldKt = parseFloat(document.getElementById('war-yield').value);
    document.getElementById('btn-war-launch').disabled = true;
    logWarMsg(`ODPALENIE GŁOWICY: ${yieldKt}kT...`);
    
    await animateMissile(warBase.latlng, warTarget.latlng, { kt: yieldKt, carrier: activeCarrier });
}

function animateMissile(start, end, data) {
    return new Promise(res => {
        const sP = map.latLngToContainerPoint(start);
        const eP = map.latLngToContainerPoint(end);
        
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '8px'; div.style.height = '8px';
        div.style.background = data.carrier === 'bomber' ? 'var(--blue)' : 'var(--red)';
        div.style.borderRadius = '50%';
        div.style.boxShadow = `0 0 15px ${data.carrier === 'bomber' ? 'var(--blue)' : 'var(--red)'}`;
        div.style.zIndex = '3000';
        div.style.left = sP.x + 'px'; div.style.top = sP.y + 'px';
        div.style.pointerEvents = 'none';
        document.getElementById('map-container').appendChild(div);

        const startTime = performance.now();
        let duration = 2000; // ICBM
        if(data.carrier === 'bomber') duration = 6000; // Bombowiec leci dłużej
        if(data.carrier === 'sub') duration = 1200;    // Okręt bliżej / szybciej

        let intercepted = false;
        let firedPatriots = new Set(); // Zapobiega ciągłemu strzelaniu z tej samej baterii

        function step(now) {
            if (intercepted) return;

            const progress = (now - startTime) / duration;
            if(progress < 1) {
                const curX = sP.x + (eP.x - sP.x) * progress;
                const arcY = Math.sin(progress * Math.PI) * 120; // Parabola lotu
                const curY = sP.y + (eP.y - sP.y) * progress - arcY;
                
                div.style.left = curX + 'px';
                div.style.top = curY + 'px';
                
                // Pozycja geograficzna pocisku na mapie
                const currentLatLng = map.containerPointToLatLng([curX, curY]);
                
                // --- KONTROLA PRZECHWYCENIA PRZEZ PATRIOT ---
                for (let i = 0; i < patriotBatteries.length; i++) {
                    const battery = patriotBatteries[i];
                    if (firedPatriots.has(i)) continue;
                    
                    const distToBattery = map.distance(currentLatLng, battery.latlng);
                    if (distToBattery <= 800000) { // Zasięg 800 km
                        firedPatriots.add(i);
                        
                        // Oblicz szansę zestrzelenia
                        let interceptChance = 0.70; // ICBM
                        if (data.carrier === 'sub') interceptChance = 0.50;
                        if (data.carrier === 'bomber') interceptChance = 0.05; // Stealth
                        
                        logWarMsg(`PRÓBA PRZECHWYCENIA PRZEZ BATERIĘ PATRIOT...`);
                        
                        // Animacja rakiety przechwytującej
                        animateInterceptor(battery.latlng, currentLatLng).then(() => {
                            if (Math.random() < interceptChance) {
                                intercepted = true;
                                if(div.parentNode) div.parentNode.removeChild(div);
                                showInterceptionEffect(currentLatLng);
                                logWarMsg("<span style='color:var(--blue);'>[SUKCES] RAKIETA PRZECHWYCONA I ZNISZCZONA!</span>");
                                document.getElementById('btn-war-launch').disabled = false;
                                res({ success: false });
                            } else {
                                logWarMsg("<span style='color:var(--red);'>[PORAŻKA] PRÓBA PRZECHWYCENIA NIEUDANA.</span>");
                            }
                        });
                    }
                }
                
                if (!intercepted) requestAnimationFrame(step);
            } else {
                if(div.parentNode) div.parentNode.removeChild(div);
                detonate(end, data);
                res({ success: true });
            }
        }
        requestAnimationFrame(step);
    });
}

function animateInterceptor(start, end) {
    return new Promise(res => {
        const sP = map.latLngToContainerPoint(start);
        
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '5px'; div.style.height = '5px';
        div.style.background = 'var(--blue)';
        div.style.borderRadius = '50%';
        div.style.boxShadow = '0 0 10px var(--blue)';
        div.style.zIndex = '3005';
        div.style.left = sP.x + 'px'; div.style.top = sP.y + 'px';
        div.style.pointerEvents = 'none';
        document.getElementById('map-container').appendChild(div);
        
        const startTime = performance.now();
        const duration = 500; // Szybki pocisk Patriot
        
        function step(now) {
            const progress = (now - startTime) / duration;
            // Aktualizujemy cel, bo rakieta leci do ruchomego celu
            const eP = map.latLngToContainerPoint(end);
            
            if(progress < 1) {
                const curX = sP.x + (eP.x - sP.x) * progress;
                const curY = sP.y + (eP.y - sP.y) * progress;
                div.style.left = curX + 'px';
                div.style.top = curY + 'px';
                requestAnimationFrame(step);
            } else {
                if(div.parentNode) div.parentNode.removeChild(div);
                res();
            }
        }
        requestAnimationFrame(step);
    });
}

function showInterceptionEffect(latlng) {
    const flashCircle = L.circle(latlng, {
        radius: 50 * 1000,
        color: 'var(--blue)',
        fillColor: '#fff',
        fillOpacity: 0.8
    }).addTo(map);
    
    setTimeout(() => {
        let opacity = 0.8;
        const interval = setInterval(() => {
            opacity -= 0.1;
            if (opacity <= 0) {
                clearInterval(interval);
                map.removeLayer(flashCircle);
            } else {
                flashCircle.setStyle({ fillOpacity: opacity, opacity: opacity });
            }
        }, 50);
    }, 100);
}

function detonate(latlng, data) {
    const mapEl = document.getElementById('map-container');
    mapEl.style.filter = "brightness(5) sepia(1) hue-rotate(-50deg)";
    setTimeout(() => mapEl.style.filter = "none", 300);
    
    const height = document.getElementById('war-height').value;
    
    // Obliczanie stref zniszczeń
    let yieldFactor = Math.pow(data.kt, 1/3);
    let scale = height === 'airburst' ? 1.5 : 1.0;
    
    const zones = [
        { r: yieldFactor * 3300 * scale, col: '#555', label: 'Podmuch' },
        { r: yieldFactor * 1100 * scale, col: '#ff2a2a', label: 'Zniszczenia' },
        { r: yieldFactor * 150, col: '#ffff00', label: 'Kula ognia' } // Kula ognia się nie zmienia od wysokości
    ];

    zones.forEach(z => {
        const c = L.circle(latlng, { radius: z.r, color: z.col, fillOpacity: 0.25 }).addTo(map);
        activeLayers.push(c);
    });
    
    // --- OPAD RADIOAKTYWNY (Tylko detonacja naziemna) ---
    if (height === 'surface') {
        const windSpeed = parseFloat(document.getElementById('wind-speed').value);
        const windDir = parseFloat(document.getElementById('war-wind-dir').value);
        
        // Matematyka elipsy opadu
        const rad = windDir * Math.PI / 180;
        const L_km = Math.pow(data.kt, 0.4) * windSpeed * 0.1; // Długość opadu
        const W_km = L_km * 0.25; // Szerokość opadu
        
        const lat_tip = latlng.lat + (L_km / 111.3) * Math.cos(rad);
        const lng_tip = latlng.lng + (L_km / (111.3 * Math.cos(latlng.lat * Math.PI / 180))) * Math.sin(rad);
        
        const lat_left = latlng.lat + (0.3 * L_km / 111.3) * Math.cos(rad) + (W_km / 111.3) * Math.cos(rad + Math.PI/2);
        const lng_left = latlng.lng + (0.3 * L_km / (111.3 * Math.cos(latlng.lat * Math.PI / 180))) * Math.sin(rad) + (W_km / (111.3 * Math.cos(latlng.lat * Math.PI / 180))) * Math.sin(rad + Math.PI/2);
        
        const lat_right = latlng.lat + (0.3 * L_km / 111.3) * Math.cos(rad) + (W_km / 111.3) * Math.cos(rad - Math.PI/2);
        const lng_right = latlng.lng + (0.3 * L_km / (111.3 * Math.cos(latlng.lat * Math.PI / 180))) * Math.sin(rad) + (W_km / (111.3 * Math.cos(latlng.lat * Math.PI / 180))) * Math.sin(rad - Math.PI/2);
        
        const falloutPoly = L.polygon([
            latlng,
            [lat_left, lng_left],
            [lat_tip, lng_tip],
            [lat_right, lng_right]
        ], {
            color: '#ff7700',
            fillColor: '#ff7700',
            fillOpacity: 0.12,
            dashArray: '4, 4',
            weight: 1.5
        }).addTo(map);
        activeLayers.push(falloutPoly);
        logWarMsg("WYKRYTO OPAD RADIOAKTYWNY (FALLOUT PLUME).");
    }
    
    logWarMsg(`DETONACJA: ${data.kt} KT (${height === 'airburst' ? 'POWIETRZNA' : 'NAZIEMNA'}).`);
    document.getElementById('btn-war-launch').disabled = false;
    
    // Dodaj megatony do globalnego licznika
    let megatons = data.kt >= 1000 ? (data.kt / 1000) : 1;
    if(window.addGlobalDetonation) window.addGlobalDetonation(megatons);
}

window.clearWarMap = function() {
    activeLayers.forEach(l => map.removeLayer(l));
    if(warBase) map.removeLayer(warBase.marker);
    if(warTarget) map.removeLayer(warTarget.marker);
    activeLayers = []; warBase = null; warTarget = null; patriotBatteries = [];
    document.getElementById('btn-war-launch').disabled = true;
    document.getElementById('war-stats').innerHTML = "";
    document.getElementById('war-scenario').value = "none";
    logWarMsg("RESET SYSTEMÓW DOWODZENIA.");
}

function logWarMsg(msg) {
    const box = document.getElementById('war-log');
    box.innerHTML = `> ${msg}<br>` + box.innerHTML;
}

// ==============================================
// 4. SCENARIUSZE HISTORYCZNE I GEOPOLITYCZNE
// ==============================================
let skynetInterval = null;

window.loadScenario = function(scenName) {
    // Zatrzymaj Skynet jeśli działa w tle
    if (skynetInterval) {
        clearInterval(skynetInterval);
        skynetInterval = null;
    }
    
    clearWarMap();
    
    if (scenName === 'none') return;
    
    if (scenName === 'cuba') {
        map.setView([24, -81], 6);
        
        // Radziecka Baza na Kubie (Havana)
        const baseLatLng = [23.0, -82.3];
        const mBase = L.marker(baseLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">⚓</div>' }) }).addTo(map);
        warBase = { latlng: baseLatLng, marker: mBase };
        
        // Cel w Miami
        const targetLatLng = [25.77, -80.19];
        const mTarget = L.marker(targetLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">🎯</div>' }) }).addTo(map);
        warTarget = { latlng: targetLatLng, marker: mTarget };
        
        // Bateria Patriot w Homestead (Floryda) - zasięg obrony Miami
        const patriotLatLng = [25.48, -80.47];
        const mPatriot = L.marker(patriotLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' }) }).addTo(map);
        const circle = L.circle(patriotLatLng, {
            radius: 400 * 1000, // 400km
            color: 'var(--blue)',
            weight: 1,
            dashArray: '3, 5',
            fillOpacity: 0.05
        }).addTo(map);
        
        patriotBatteries.push({ latlng: patriotLatLng, marker: mPatriot, circle });
        activeLayers.push(mPatriot, circle);
        
        // Ustawienie typu broni
        activeCarrier = 'icbm';
        document.getElementById('war-yield').value = "350";
        document.getElementById('war-height').value = "surface";
        
        updateWarStats();
        logWarMsg("SCENARIUSZ: KRYZYS KUBAŃSKI 1962. BATERIA PATRIOT ZAINSTALOWANA NA FLORYDZIE (400KM).");
    } 
    else if (scenName === 'coldwar') {
        map.setView([45, 0], 2);
        
        logWarMsg("INICJUJĘ NAJCZARNIEJSZY SCENARIUSZ ZIMNEJ WOJNY...");
        logWarMsg("WYLICZANIE CELÓW STRATEGICZNYCH (USA vs ZSRR)...");
        
        // Symulacja masowej salwy
        const bases = [
            { name: "Silos Wyoming (USA)", latlng: [41.1, -104.8], side: "us" },
            { name: "Silos North Dakota (USA)", latlng: [47.5, -101.3], side: "us" },
            { name: "Silos Kozielsk (ZSRR)", latlng: [54.0, 35.7], side: "ussr" },
            { name: "Silos Użur (ZSRR)", latlng: [55.3, 89.8], side: "ussr" }
        ];
        
        const targets = [
            { name: "Moskwa", latlng: [55.75, 37.61], side: "us_target" },
            { name: "Leningrad", latlng: [59.93, 30.33], side: "us_target" },
            { name: "Nowy Jork", latlng: [40.71, -74.00], side: "ussr_target" },
            { name: "Waszyngton", latlng: [38.90, -77.03], side: "ussr_target" }
        ];
        
        // Rysuj bazy i cele
        bases.forEach(b => {
            const m = L.marker(b.latlng, { icon: L.divIcon({ className:'', html:`<div style="font-size:18px;">🏢</div>` }) }).addTo(map);
            activeLayers.push(m);
        });
        targets.forEach(t => {
            const m = L.marker(t.latlng, { icon: L.divIcon({ className:'', html:`<div style="font-size:18px;">🎯</div>` }) }).addTo(map);
            activeLayers.push(m);
        });
        
        // Dodajmy po jednej tarczy patriot wokół Waszyngtonu i Moskwy
        const pats = [
            { latlng: [38.90, -77.03], range: 600 }, // Waszyngton
            { latlng: [55.75, 37.61], range: 600 }  // Moskwa
        ];
        
        pats.forEach(p => {
            const m = L.marker(p.latlng, { icon: L.divIcon({ className:'', html:'<div style="font-size:20px;">🛡️</div>' }) }).addTo(map);
            const c = L.circle(p.latlng, { radius: p.range * 1000, color: 'var(--blue)', weight: 1, dashArray: '2, 4', fillOpacity: 0.03 }).addTo(map);
            patriotBatteries.push({ latlng: p.latlng, marker: m, circle: c });
            activeLayers.push(m, c);
        });
        
        // Automatyczny start sekwencyjny po 2 sekundach
        setTimeout(() => {
            // US Silos strzelają do ZSRR
            animateMissile(bases[0].latlng, targets[0].latlng, { kt: 800, carrier: "icbm" });
            animateMissile(bases[1].latlng, targets[1].latlng, { kt: 800, carrier: "icbm" });
            
            // ZSRR Silos strzelają do USA
            setTimeout(() => {
                animateMissile(bases[2].latlng, targets[2].latlng, { kt: 800, carrier: "icbm" });
                animateMissile(bases[3].latlng, targets[3].latlng, { kt: 800, carrier: "icbm" });
            }, 500);
        }, 1500);
    } 
    else if (scenName === 'skynet') {
        map.setView([30, 0], 2);
        logWarMsg("<span style='color:var(--red); font-weight:bold;'>[ALERT] SKYNET UZYSKAŁ AUTONOMIĘ.</span>");
        logWarMsg("<span style='color:var(--red);'>PRZEJMOWANIE SILOSÓW BALISTYCZNYCH...</span>");
        
        let counter = 0;
        skynetInterval = setInterval(() => {
            if (counter >= 15) { // 15 rakiet w serii
                clearInterval(skynetInterval);
                logWarMsg("PROTOKÓŁ ZAKOŃCZONY. LUDZKOŚĆ UNICESTWIONA.");
                return;
            }
            
            // Losowe punkty na globie
            const randBase = [ (Math.random() * 50) + 10, (Math.random() * 120) - 60 ];
            const randTarget = [ (Math.random() * 50) + 10, (Math.random() * 120) - 60 ];
            
            // Umieść chwilowy marker
            const mB = L.marker(randBase, { icon: L.divIcon({ className:'', html:'<div style="font-size:16px;">🤖</div>' }) }).addTo(map);
            const mT = L.marker(randTarget, { icon: L.divIcon({ className:'', html:'<div style="font-size:16px;">🎯</div>' }) }).addTo(map);
            activeLayers.push(mB, mT);
            
            animateMissile(randBase, randTarget, { kt: 350, carrier: "icbm" });
            counter++;
        }, 800);
    }
}
