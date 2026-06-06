// war_room.js - Moduł 2: War Room (Pełna mapa taktyczna i strategiczna) + Moduł 3: Misje i Wyzwania

let map;
let darkLayer, satLayer;
let warBase = null;
let warTarget = null;
let activeLayers = [];
let patriotBatteries = []; // { latlng, marker, circle }
let isWarRoomInitialized = false;
let selectionMode = 'base'; // 'base' lub 'target'
let activeCarrier = 'icbm';
let activeWarYield = 350; // Domyślna moc w KT

// Stan aktywnej misji
let activeMissionId = null;
let activeMissionBasesRemaining = 0;
let activeMissionMissilesRemaining = 0;
let missionTargetLatLng = null;

window.initWarRoom = function() {
    if(isWarRoomInitialized) {
        map.invalidateSize();
        return;
    }
    
    setTimeout(() => {
        const bounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
        map = L.map('map-container', { 
            zoomControl: false, 
            attributionControl: false,
            minZoom: 2,
            maxBounds: bounds,
            maxBoundsViscosity: 1.0
        }).setView([30, 0], 2);

        // Zapobiegamy dublowaniu kontynentów przez { noWrap: true }
        darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            noWrap: true,
            bounds: bounds
        }).addTo(map);

        satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            noWrap: true,
            bounds: bounds
        });

        map.on('click', handleMapClick);
        isWarRoomInitialized = true;
        
        initWarArsenalUI(); // Inicjalizacja kafelków arsenału
        
        logWarMsg("SYSTEM WDS INICJOWANY...");
    }, 100);
}

// Funkcja budująca nowe kafelki wyboru broni
function initWarArsenalUI() {
    const container = document.getElementById('war-arsenal-container');
    if (!container) return;
    
    // Tworzenie zakładek
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'arsenal-tab-container';
    
    const categories = ['Tactical', 'Strategic', 'Milestones'];
    const labels = ['Taktyczne', 'Strategiczne', 'Giganty'];
    let activeCat = 'Tactical';
    
    const itemsContainer = document.createElement('div');
    
    const renderItems = (cat) => {
        itemsContainer.innerHTML = '';
        const items = window.nuclearData.filter(d => d.category === cat).sort((a,b) => a.yield_kt - b.yield_kt);
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'arsenal-item';
            if (activeWarYield === item.yield_kt) el.classList.add('selected');
            
            el.innerHTML = `
                <div class="i-name">${item.name}</div>
                <div class="i-yield">${item.yield_kt.toLocaleString()} kT</div>
            `;
            el.onclick = () => {
                activeWarYield = item.yield_kt;
                if (window.notifyCampaignAction) window.notifyCampaignAction('yield_change', activeWarYield);
                renderItems(activeCat);
            };
            itemsContainer.appendChild(el);
        });
    };

    categories.forEach((cat, idx) => {
        const tab = document.createElement('div');
        tab.className = 'arsenal-tab';
        if (cat === activeCat) tab.classList.add('active');
        tab.innerText = labels[idx];
        tab.onclick = () => {
            activeCat = cat;
            document.querySelectorAll('#war-arsenal-container .arsenal-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderItems(activeCat);
        };
        tabsContainer.appendChild(tab);
    });
    
    container.innerHTML = '';
    container.appendChild(tabsContainer);
    container.appendChild(itemsContainer);
    renderItems(activeCat);
}

window.changeDefcon = function(level) {
    logWarMsg(`UWAGA: POZIOM ZAGROŻENIA ZMIENIONY NA DEFCON ${level}`);
    if (window.notifyCampaignAction) window.notifyCampaignAction('defcon_change', parseInt(level));
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
    
    // Blokada w misjach
    if (activeMissionId) {
        if (activeCarrier !== 'patriot') {
            if (selectionMode === 'base') {
                if (activeMissionBasesRemaining <= 0) {
                    logWarMsg("BŁĄD: OSIĄGNIĘTO LIMIT POZYCJI STARTOWYCH DLA TEJ MISJI.");
                    return;
                }
                
                // Specyficzny warunek dla misji "Cicha Woda" - odległość okrętu od celu < 1000km
                if (activeMissionId === 'm1' && missionTargetLatLng) {
                    const distToLondon = map.distance(latlng, missionTargetLatLng) / 1000;
                    if (distToLondon > 1000) {
                        logWarMsg(`<span style="color:var(--red);">BŁĄD: OKRĘT MUSI BYĆ BLIŻEJ CELU (AKTUALNIE: ${distToLondon.toFixed(0)} KM. WYMAGANE < 1000 KM).</span>`);
                        return;
                    }
                }
                
                if(warBase) map.removeLayer(warBase.marker);
                let iconHtml = '🏢';
                if (activeCarrier === 'sub') iconHtml = '⚓';
                if (activeCarrier === 'bomber') iconHtml = '✈️';
                
                const m = L.marker(latlng, { icon: L.divIcon({ className:'', html:`<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">${iconHtml}</div>` }) }).addTo(map);
                warBase = { latlng, marker: m };
                activeMissionBasesRemaining--;
                selectionMode = 'target'; // chociaż cel jest już z góry ustalony w misji
                logWarMsg("POZYCJA STARTOWA ZABEZPIECZONA. ROZPOCZNIJ OSTRZAŁ.");
            } else {
                logWarMsg("BŁĄD: CEL TEJ MISJI JEST JUŻ USTALONY ODGÓRNIE.");
                return;
            }
        }
        updateWarStats();
        return;
    }

    if (activeCarrier === 'patriot') {
        const batteryIcon = L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' });
        const marker = L.marker(latlng, { icon: batteryIcon }).addTo(map);
        
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
        if(selectionMode === 'base') {
            if(warBase) map.removeLayer(warBase.marker);
            let iconHtml = '🏢';
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
            if (window.notifyCampaignAction) window.notifyCampaignAction('map_click', { lat: latlng.lat, lng: latlng.lng });
        }
        updateWarStats();
    }
}

function updateWarStats() {
    if(warBase && warTarget) {
        const dist = (map.distance(warBase.latlng, warTarget.latlng) / 1000).toFixed(0);
        let speedKmh = 24000;
        if(activeCarrier === 'bomber') speedKmh = 1000;
        if(activeCarrier === 'sub') speedKmh = 8000;
        
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
    
    // Obsługa limitu pocisków w misjach
    if (activeMissionId) {
        if (activeMissionMissilesRemaining <= 0) {
            logWarMsg("BŁĄD: BRAK AMUNICJI DO WYKONANIA TEJ MISJI.");
            return;
        }
        activeMissionMissilesRemaining--;
        logWarMsg(`WYSTRZELONO POCISK. POZOSTAŁO: ${activeMissionMissilesRemaining}`);
    }

    const yieldKt = activeWarYield;
    document.getElementById('btn-war-launch').disabled = true;
    logWarMsg(`ODPALENIE GŁOWICY: ${yieldKt}kT...`);

    let windSpeed = 0;
    let windDir = 0;
    try {
        const targetLatLng = warTarget.latlng;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${targetLatLng.lat}&longitude=${targetLatLng.lng}&current_weather=true`;
        const wRes = await fetch(weatherUrl);
        const wData = await wRes.json();
        windSpeed = wData.current_weather.windspeed;
        windDir = wData.current_weather.winddirection;
        logWarMsg(`POGODA Z SATELITY: WIATR ${windSpeed} km/h (KIERUNEK ${windDir}°)`);
    } catch (e) {
        logWarMsg("BŁĄD SONDY POGODOWEJ.");
    }
    
    if (window.notifyCampaignAction) window.notifyCampaignAction('launch', { lat: warTarget.latlng.lat, lng: warTarget.latlng.lng, yield: yieldKt });
    
    const result = await animateMissile(warBase.latlng, warTarget.latlng, { kt: yieldKt, carrier: activeCarrier, windSpeed, windDir });
    
    // Sprawdzanie warunków wygranej / przegranej w misjach
    if (activeMissionId) {
        if (result.success && result.hitTarget) {
            // ZWYCIĘSTWO!
            showMissionModal(true, "OPERACJA POWIODŁA SIĘ!", "Cel strategiczny został całkowicie zniszczony. Przełamałeś obronę wroga. Gratulacje, dowódco!");
            clearWarMap();
        } else {
            // Pocisk został przechwycony lub chybił, a skończyła się amunicja
            if (activeMissionMissilesRemaining <= 0) {
                setTimeout(() => {
                    showMissionModal(false, "OPERACJA NIEUDANA", "Wszystkie Twoje pociski zostały przechwycone lub chybiły celu. Wróg zdołał się obronić.");
                    clearWarMap();
                }, 1000);
            } else {
                document.getElementById('btn-war-launch').disabled = false;
            }
        }
    }
}

// Fizyka pocisków: LatLng interpolation (odporna na przesuwanie i zoomowanie mapy)
function animateMissile(start, end, data) {
    const startLatLng = L.latLng(start);
    const endLatLng = L.latLng(end);

    return new Promise(res => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '8px'; div.style.height = '8px';
        div.style.background = data.carrier === 'bomber' ? 'var(--blue)' : 'var(--red)';
        div.style.borderRadius = '50%';
        div.style.boxShadow = `0 0 15px ${data.carrier === 'bomber' ? 'var(--blue)' : 'var(--red)'}`;
        div.style.zIndex = '3000';
        div.style.pointerEvents = 'none';
        
        // Ustawienie początkowej pozycji pikselowej
        const initPoint = map.latLngToContainerPoint(startLatLng);
        div.style.left = initPoint.x + 'px'; div.style.top = initPoint.y + 'px';
        document.getElementById('map-container').appendChild(div);

        const startTime = performance.now();
        let duration = 2000; // ICBM
        if(data.carrier === 'bomber') duration = 6000;
        if(data.carrier === 'sub') duration = 1200;

        let intercepted = false;
        let firedPatriots = new Set();

        // Obiekt pomocniczy do dynamicznego przekazywania współrzędnych rakiety do antyrakiet Patriot
        let currentPosHolder = { latlng: startLatLng };

        function step(now) {
            if (intercepted) return;

            const progress = (now - startTime) / duration;
            if(progress < 1) {
                // Interpolacja współrzędnych geograficznych (odporne na zoom/pan)
                const curLat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * progress;
                const curLng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * progress;
                const currentLatLng = L.latLng(curLat, curLng);
                currentPosHolder.latlng = currentLatLng;

                // Przeliczenie pozycji geograficznej na piksele kontenera na żywo
                const curPoint = map.latLngToContainerPoint(currentLatLng);
                const arcY = Math.sin(progress * Math.PI) * 120; // Parabola wysokości
                
                div.style.left = curPoint.x + 'px';
                div.style.top = (curPoint.y - arcY) + 'px';
                
                // --- KONTROLA PRZECHWYCENIA PRZEZ PATRIOT ---
                for (let i = 0; i < patriotBatteries.length; i++) {
                    const battery = patriotBatteries[i];
                    if (firedPatriots.has(i)) continue;
                    
                    const distToBattery = map.distance(currentLatLng, battery.latlng);
                    if (distToBattery <= 800000) { // Zasięg 800 km
                        firedPatriots.add(i);
                        
                        let interceptChance = 0.70;
                        if (data.carrier === 'sub') interceptChance = 0.50;
                        if (data.carrier === 'bomber') interceptChance = 0.05; // Stealth
                        
                        logWarMsg(`PRÓBA PRZECHWYCENIA PRZEZ BATERIĘ PATRIOT...`);
                        
                        animateInterceptor(battery.latlng, currentPosHolder).then(() => {
                            if (Math.random() < interceptChance) {
                                intercepted = true;
                                if(div.parentNode) div.parentNode.removeChild(div);
                                showInterceptionEffect(currentLatLng);
                                logWarMsg("<span style='color:var(--blue);'>[SUKCES] RAKIETA PRZECHWYCONA I ZNISZCZONA!</span>");
                                res({ success: false, hitTarget: false });
                            } else {
                                logWarMsg("<span style='color:var(--red);'>[PORAŻKA] PRÓBA PRZECHWYCENIA NIEUDANA.</span>");
                            }
                        });
                    }
                }
                
                if (!intercepted) requestAnimationFrame(step);
            } else {
                if(div.parentNode) div.parentNode.removeChild(div);
                detonate(endLatLng, data);
                
                // Weryfikacja czy uderzenie jest wystarczająco blisko celu
                let hitTarget = false;
                if (missionTargetLatLng) {
                    const distToTarget = map.distance(endLatLng, missionTargetLatLng);
                    if (distToTarget <= 50000) { // trafienie w promieniu 50km
                        hitTarget = true;
                    }
                }
                
                res({ success: true, hitTarget: hitTarget });
            }
        }
        requestAnimationFrame(step);
    });
}

// Fizyka antyrakiety: Dynamiczne śledzenie pozycji rakiety na podstawie LatLng
function animateInterceptor(start, targetHolder) {
    const startLatLng = L.latLng(start);

    return new Promise(res => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '5px'; div.style.height = '5px';
        div.style.background = 'var(--blue)';
        div.style.borderRadius = '50%';
        div.style.boxShadow = '0 0 10px var(--blue)';
        div.style.zIndex = '3005';
        div.style.pointerEvents = 'none';
        
        const initPoint = map.latLngToContainerPoint(startLatLng);
        div.style.left = initPoint.x + 'px'; div.style.top = initPoint.y + 'px';
        document.getElementById('map-container').appendChild(div);
        
        const startTime = performance.now();
        const duration = 500;
        
        function step(now) {
            const progress = (now - startTime) / duration;
            
            if(progress < 1) {
                // Pobieramy aktualną geolokalizację wrogiej rakiety
                const targetLatLng = targetHolder.latlng;
                
                // Przeliczamy i animujemy
                const sP = map.latLngToContainerPoint(startLatLng);
                const eP = map.latLngToContainerPoint(targetLatLng);
                
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
    let yieldFactor = Math.pow(data.kt, 1/3);
    let scale = height === 'airburst' ? 1.5 : 1.0;
    
    const zones = [
        { r: yieldFactor * 3300 * scale, col: '#555', label: 'Podmuch' },
        { r: yieldFactor * 1100 * scale, col: '#ff2a2a', label: 'Zniszczenia' },
        { r: yieldFactor * 150, col: '#00ff41', label: 'Kula ognia' }
    ];

    zones.forEach(z => {
        const c = L.circle(latlng, { radius: z.r, color: z.col, weight: 2, fillOpacity: 0.2 }).addTo(map);
        activeLayers.push(c);
    });
    
    if (height === 'surface') {
        const windSpeed = data.windSpeed || 0;
        const windDir = data.windDir || 0;
        
        const rad = windDir * Math.PI / 180;
        const L_km = Math.pow(data.kt, 0.4) * windSpeed * 0.1;
        const W_km = L_km * 0.25;
        
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
    
    // Przywracamy normalny widok guzików Triady po wyjściu z misji
    document.querySelectorAll('.triad-btn').forEach(b => {
        b.style.display = 'block';
    });
    document.getElementById('btn-war-target').disabled = false;
    
    activeMissionId = null;
    missionTargetLatLng = null;
    logWarMsg("RESET SYSTEMÓW DOWODZENIA.");
}

function logWarMsg(msg) {
    const box = document.getElementById('war-log');
    box.innerHTML = `> ${msg}<br>` + box.innerHTML;
}

// ==============================================
// SCENARIUSZE HISTORYCZNE
// ==============================================
let skynetInterval = null;

window.loadScenario = function(scenName) {
    if (skynetInterval) {
        clearInterval(skynetInterval);
        skynetInterval = null;
    }
    
    clearWarMap();
    if (scenName === 'none') return;
    
    if (scenName === 'cuba') {
        map.setView([24, -81], 6);
        
        const baseLatLng = [23.0, -82.3];
        const mBase = L.marker(baseLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">⚓</div>' }) }).addTo(map);
        warBase = { latlng: baseLatLng, marker: mBase };
        
        const targetLatLng = [25.77, -80.19];
        const mTarget = L.marker(targetLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">🎯</div>' }) }).addTo(map);
        warTarget = { latlng: targetLatLng, marker: mTarget };
        
        const patriotLatLng = [25.48, -80.47];
        const mPatriot = L.marker(patriotLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' }) }).addTo(map);
        const circle = L.circle(patriotLatLng, {
            radius: 400 * 1000,
            color: 'var(--blue)',
            weight: 1,
            dashArray: '3, 5',
            fillOpacity: 0.05
        }).addTo(map);
        
        patriotBatteries.push({ latlng: patriotLatLng, marker: mPatriot, circle });
        activeLayers.push(mPatriot, circle);
        
        activeCarrier = 'icbm';
        activeWarYield = 350;
        document.getElementById('war-height').value = "surface";
        initWarArsenalUI();
        
        updateWarStats();
        logWarMsg("SCENARIUSZ: KRYZYS KUBAŃSKI 1962.");
    } 
    else if (scenName === 'coldwar') {
        map.setView([45, 0], 2);
        
        logWarMsg("INICJUJĘ NAJCZARNIEJSZY SCENARIUSZ ZIMNEJ WOJNY...");
        
        const bases = [
            { name: "Silos Wyoming", latlng: [41.1, -104.8] },
            { name: "Silos North Dakota", latlng: [47.5, -101.3] },
            { name: "Silos Kozielsk", latlng: [54.0, 35.7] },
            { name: "Silos Użur", latlng: [55.3, 89.8] }
        ];
        
        const targets = [
            { name: "Moskwa", latlng: [55.75, 37.61] },
            { name: "Leningrad", latlng: [59.93, 30.33] },
            { name: "Nowy Jork", latlng: [40.71, -74.00] },
            { name: "Waszyngton", latlng: [38.90, -77.03] }
        ];
        
        bases.forEach(b => {
            const m = L.marker(b.latlng, { icon: L.divIcon({ className:'', html:`<div style="font-size:18px;">🏢</div>` }) }).addTo(map);
            activeLayers.push(m);
        });
        targets.forEach(t => {
            const m = L.marker(t.latlng, { icon: L.divIcon({ className:'', html:`<div style="font-size:18px;">🎯</div>` }) }).addTo(map);
            activeLayers.push(m);
        });
        
        const pats = [
            { latlng: [38.90, -77.03], range: 600 },
            { latlng: [55.75, 37.61], range: 600 }
        ];
        
        pats.forEach(p => {
            const m = L.marker(p.latlng, { icon: L.divIcon({ className:'', html:'<div style="font-size:20px;">🛡️</div>' }) }).addTo(map);
            const c = L.circle(p.latlng, { radius: p.range * 1000, color: 'var(--blue)', weight: 1, dashArray: '2, 4', fillOpacity: 0.03 }).addTo(map);
            patriotBatteries.push({ latlng: p.latlng, marker: m, circle: c });
            activeLayers.push(m, c);
        });
        
        setTimeout(() => {
            animateMissile(bases[0].latlng, targets[0].latlng, { kt: 800, carrier: "icbm" });
            animateMissile(bases[1].latlng, targets[1].latlng, { kt: 800, carrier: "icbm" });
            
            setTimeout(() => {
                animateMissile(bases[2].latlng, targets[2].latlng, { kt: 800, carrier: "icbm" });
                animateMissile(bases[3].latlng, targets[3].latlng, { kt: 800, carrier: "icbm" });
            }, 500);
        }, 1500);
    } 
    else if (scenName === 'skynet') {
        map.setView([30, 0], 2);
        logWarMsg("<span style='color:var(--red); font-weight:bold;'>[ALERT] SKYNET UZYSKAŁ AUTONOMIĘ.</span>");
        
        let counter = 0;
        skynetInterval = setInterval(() => {
            if (counter >= 15) {
                clearInterval(skynetInterval);
                logWarMsg("PROTOKÓŁ ZAKOŃCZONY. LUDZKOŚĆ UNICESTWIONA.");
                return;
            }
            
            const randBase = [ (Math.random() * 50) + 10, (Math.random() * 120) - 60 ];
            const randTarget = [ (Math.random() * 50) + 10, (Math.random() * 120) - 60 ];
            
            const mB = L.marker(randBase, { icon: L.divIcon({ className:'', html:'<div style="font-size:16px;">🤖</div>' }) }).addTo(map);
            const mT = L.marker(randTarget, { icon: L.divIcon({ className:'', html:'<div style="font-size:16px;">🎯</div>' }) }).addTo(map);
            activeLayers.push(mB, mT);
            
            animateMissile(randBase, randTarget, { kt: 350, carrier: "icbm" });
            counter++;
        }, 800);
    }
}

// ==============================================
// MODUŁ 3: LOGIKA MISJI I WYZWAŃ
// ==============================================
window.startMission = function(missionId) {
    // 1. Przełączamy na tryb War Room (mapę)
    window.switchModule('war');
    clearWarMap();
    
    activeMissionId = missionId;
    
    if (missionId === 'm1') {
        // OPERACJA: CICHA WODA
        logWarMsg("<span style='color:var(--blue); font-weight:bold;'>URUCHOMIONO OPERACJĘ: CICHA WODA</span>");
        
        // Cel: Londyn
        missionTargetLatLng = L.latLng(51.5074, -0.1278);
        const mTarget = L.marker(missionTargetLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">🎯</div>' }) }).addTo(map);
        warTarget = { latlng: missionTargetLatLng, marker: mTarget };
        activeLayers.push(mTarget);
        
        // Tarcza Patriot w Londynie
        const patLatLng = L.latLng(51.50, -0.12);
        const mPat = L.marker(patLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' }) }).addTo(map);
        const circle = L.circle(patLatLng, {
            radius: 800 * 1000,
            color: 'var(--blue)',
            weight: 1,
            dashArray: '3, 5',
            fillOpacity: 0.05
        }).addTo(map);
        
        patriotBatteries.push({ latlng: patLatLng, marker: mPat, circle });
        activeLayers.push(mPat, circle);
        
        // Blokada uzbrojenia na SSBN
        activeCarrier = 'sub';
        document.querySelectorAll('.triad-btn').forEach(btn => {
            if(btn.dataset.type !== 'sub') btn.style.display = 'none';
            else btn.classList.add('active');
        });
        document.getElementById('btn-war-target').disabled = true; // Cel zablokowany
        activeWarYield = 350;
        initWarArsenalUI();
        
        // Limity
        activeMissionBasesRemaining = 1;
        activeMissionMissilesRemaining = 2;
        
        map.setView([51.5, -0.1], 4);
        logWarMsg("ZASADY: ROZMIEŚĆ OKRĘT PODWODNY ⚓ BLISKO WYBRZEŻA LONDYNU (< 1000 KM) I ODPAL POCISK SLBM. MASZ 2 POCISKI.");
    } 
    else if (missionId === 'm2') {
        // OPERACJA: STEALTH SHIELD
        logWarMsg("<span style='color:var(--blue); font-weight:bold;'>URUCHOMIONO OPERACJĘ: STEALTH SHIELD</span>");
        
        // Cel: Murmańsk
        missionTargetLatLng = L.latLng(68.97, 33.08);
        const mTarget = L.marker(missionTargetLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">🎯</div>' }) }).addTo(map);
        warTarget = { latlng: missionTargetLatLng, marker: mTarget };
        activeLayers.push(mTarget);
        
        // Bardzo silna tarcza Patriot w Murmańsku (90% szans)
        const patLatLng = L.latLng(68.97, 33.08);
        const mPat = L.marker(patLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' }) }).addTo(map);
        const circle = L.circle(patLatLng, {
            radius: 800 * 1000,
            color: 'var(--blue)',
            weight: 1.5,
            dashArray: '3, 5',
            fillOpacity: 0.08
        }).addTo(map);
        
        patriotBatteries.push({ latlng: patLatLng, marker: mPat, circle });
        activeLayers.push(mPat, circle);
        
        // Blokada na Bomber (B-2)
        activeCarrier = 'bomber';
        document.querySelectorAll('.triad-btn').forEach(btn => {
            if(btn.dataset.type !== 'bomber') btn.style.display = 'none';
            else btn.classList.add('active');
        });
        document.getElementById('btn-war-target').disabled = true;
        activeWarYield = 350;
        initWarArsenalUI();
        
        // Limity
        activeMissionBasesRemaining = 1;
        activeMissionMissilesRemaining = 1;
        
        map.setView([65, 25], 4);
        logWarMsg("ZASADY: USTAW BAZĘ BOMBOWCA ✈️ NA MAPIE I ROZPOCZNIJ ATTAK. B-2 STEALTH POWINIEN OMINĄĆ TARCZĘ. MASZ 1 SZANSĘ.");
    } 
    else if (missionId === 'm3') {
        // OPERACJA: PRZEŁAMANIE TARCZ
        logWarMsg("<span style='color:var(--blue); font-weight:bold;'>URUCHOMIONO OPERACJĘ: PRZEŁAMANIE TARCZ</span>");
        
        // Cel: Waszyngton
        missionTargetLatLng = L.latLng(38.9072, -77.0369);
        const mTarget = L.marker(missionTargetLatLng, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--red);">🎯</div>' }) }).addTo(map);
        warTarget = { latlng: missionTargetLatLng, marker: mTarget };
        activeLayers.push(mTarget);
        
        // Dwie baterie Patriot (Waszyngton i Norfolk)
        const pat1 = L.latLng(38.90, -77.03);
        const mPat1 = L.marker(pat1, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' }) }).addTo(map);
        const c1 = L.circle(pat1, { radius: 800 * 1000, color: 'var(--blue)', weight: 1, dashArray: '3, 5', fillOpacity: 0.05 }).addTo(map);
        
        const pat2 = L.latLng(36.85, -76.28);
        const mPat2 = L.marker(pat2, { icon: L.divIcon({ className:'', html:'<div style="font-size:24px; text-shadow:0 0 10px var(--blue);">🛡️</div>' }) }).addTo(map);
        const c2 = L.circle(pat2, { radius: 800 * 1000, color: 'var(--blue)', weight: 1, dashArray: '3, 5', fillOpacity: 0.05 }).addTo(map);
        
        patriotBatteries.push({ latlng: pat1, marker: mPat1, circle: c1 }, { latlng: pat2, marker: mPat2, circle: c2 });
        activeLayers.push(mPat1, c1, mPat2, c2);
        
        // Blokada na ICBM
        activeCarrier = 'icbm';
        document.querySelectorAll('.triad-btn').forEach(btn => {
            if(btn.dataset.type !== 'icbm') btn.style.display = 'none';
            else btn.classList.add('active');
        });
        document.getElementById('btn-war-target').disabled = true;
        activeWarYield = 800;
        initWarArsenalUI();
        
        // Limity
        activeMissionBasesRemaining = 3; // Można postawić 3 silosy
        activeMissionMissilesRemaining = 3;
        
        map.setView([45, -70], 3);
        logWarMsg("ZASADY: ROZSTAW 3 SILOSY BALISTYCZNE 🏢 I WYŚLIJ MASOWĄ SALWĘ 3 ICBM NA WASZYNGTON. LICZBA POCISKÓW: 3.");
    }
}

function showMissionModal(isSuccess, title, desc) {
    const modal = document.getElementById('mission-modal');
    const box = document.getElementById('mission-modal-box');
    const titleEl = document.getElementById('mission-status-title');
    const descEl = document.getElementById('mission-status-desc');
    
    titleEl.innerText = title;
    descEl.innerText = desc;
    
    if (isSuccess) {
        box.style.borderColor = 'var(--green)';
        box.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.4)';
        titleEl.style.color = 'var(--green)';
        titleEl.style.textShadow = '0 0 10px var(--green)';
    } else {
        box.style.borderColor = 'var(--red)';
        box.style.boxShadow = '0 0 30px rgba(255, 42, 42, 0.4)';
        titleEl.style.color = 'var(--red)';
        titleEl.style.textShadow = '0 0 10px var(--red)';
    }
    
    modal.style.display = 'flex';
}

window.closeMissionModal = function() {
    document.getElementById('mission-modal').style.display = 'none';
    window.switchModule('missions');
}
