// survival.js - Moduł 1: Kalkulator Przetrwania (Viral)

document.addEventListener('DOMContentLoaded', () => {
    const btnCheck = document.getElementById('btn-check-survival');
    const inputCity = document.getElementById('survival-city');
    const reportBox = document.getElementById('survival-report');
    const reportText = document.getElementById('survival-report-text');
    const btnShare = document.getElementById('btn-share-report');

    btnCheck.addEventListener('click', async () => {
        const city = inputCity.value.trim();
        if(!city) {
            alert("Podaj miasto, aby rozpocząć symulację.");
            return;
        }

        btnCheck.disabled = true;
        btnCheck.innerText = "KALKULOWANIE...";
        reportBox.style.display = 'none';

        try {
            // 1. Geocoding z darmowego Nominatim
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if(data.length === 0) {
                alert("Nie odnaleziono lokacji w bazie. Spróbuj większego miasta.");
                btnCheck.disabled = false;
                btnCheck.innerText = "PRZEPROWADŹ SYMULACJĘ";
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            const locationName = data[0].display_name.split(',')[0];

            // 2. Pobranie pogody (API Open-Meteo)
            let windSpeed = 0;
            let windDir = 0;
            try {
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
                const wRes = await fetch(weatherUrl);
                const wData = await wRes.json();
                windSpeed = wData.current_weather.windspeed;
                windDir = wData.current_weather.winddirection;
            } catch(we) {
                console.warn("Brak danych pogodowych:", we);
            }

            // 3. Symulacja uderzenia i wygenerowanie raportu
            const kt = activeSurvivalYield;
            generateReport(locationName, lat, lon, kt, windSpeed, windDir);
            
            // 3. Wysłanie danych do Globalnego Licznika (app.js)
            let megatons = kt >= 1000 ? (kt / 1000) : 1; // Przeliczamy kt na całe megatony do licznika (w uproszczeniu)
            if(window.addGlobalDetonation) window.addGlobalDetonation(megatons);

        } catch (e) {
            alert("Błąd połączenia z satelitą (API). Spróbuj ponownie.");
            console.error(e);
        }

        btnCheck.disabled = false;
        btnCheck.innerText = "PONÓW SYMULACJĘ";
    });

    btnShare.addEventListener('click', () => {
        // html2canvas do zrobienia zrzutu ekranu certyfikatu
        if(typeof html2canvas === 'undefined') {
            alert("Brak modułu generowania. Odśwież stronę.");
            return;
        }
        
        btnShare.style.display = 'none'; // Ukrywamy przycisk na screenie
        
        html2canvas(document.getElementById('survival-ui'), {
            backgroundColor: "#050a05"
        }).then(canvas => {
            btnShare.style.display = 'block'; // Przywracamy przycisk
            
            // Pobranie pliku
            const link = document.createElement('a');
            link.download = 'raport_taktyczny.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    function generateReport(city, lat, lon, yieldKt, windSpeed = 0, windDir = 0) {
        // Uproszczona matematyka promieni zniszczeń wg reguły pierwiastka 3 stopnia
        const r_fireball = Math.pow(yieldKt, 1/3) * 0.15; // Kula ognia [km]
        const r_heavy = Math.pow(yieldKt, 1/3) * 1.1;     // Zniszczenia ciężkie (20 psi) [km]
        const r_light = Math.pow(yieldKt, 1/3) * 3.3;     // Zniszczenia lekkie (1 psi) [km]

        // Symulujemy losowe przesunięcie celu od centrum miasta (aby użytkownik poczuł, że "dostał" w różnej odległości)
        // W odległości od 0 do połowy promienia lekkich zniszczeń
        const distanceFromGroundZero = (Math.random() * (r_light * 0.8)).toFixed(2);
        
        let statusClass = '';
        let statusText = '';
        let damageText = '';

        if(distanceFromGroundZero <= r_fireball) {
            statusClass = '';
            statusText = `<span style="color:red; font-weight:bold;">SZANSE PRZETRWANIA: 0%</span>`;
            damageText = `Znajdujesz się bezpośrednio w strefie kuli ognia. Temperatura przekroczyła milion stopni Celsjusza. Wszystko w promieniu ${r_fireball.toFixed(2)} km wyparowało w ułamku sekundy.`;
        } else if (distanceFromGroundZero <= r_heavy) {
            statusClass = '';
            statusText = `<span style="color:orange; font-weight:bold;">SZANSE PRZETRWANIA: 2%</span>`;
            damageText = `Jesteś w strefie ekstremalnych zniszczeń. Fala uderzeniowa zmiotła betonowe budynki z powierzchni ziemi. Jeśli nie byłeś w głębokim bunkrze, nie masz szans.`;
        } else if (distanceFromGroundZero <= r_light) {
            statusClass = 'success';
            statusText = `<span style="color:yellow; font-weight:bold;">SZANSE PRZETRWANIA: 45%</span>`;
            damageText = `Znajdujesz się na obrzeżach. Promieniowanie cieplne wywołało pożary, a fala nadciśnienia wybiła wszystkie szyby w okolicy, co jest główną przyczyną rannych. Szukaj schronienia przed opadem (fallout).`;
        } else {
            statusClass = 'success';
            statusText = `<span style="color:lime; font-weight:bold;">SZANSE PRZETRWANIA: 95%</span>`;
            damageText = `Fizyczna fala uderzeniowa tu nie dotarła, ale widzisz błysk na horyzoncie. Masz około 15 minut, zanim wiatr przyniesie chmurę radioaktywną. Ewakuuj się.`;
        }

        reportText.innerHTML = `
            <strong>CEL:</strong> ${city}<br>
            <strong>TWOJA POZYCJA:</strong> ${distanceFromGroundZero} km od Ground Zero<br>
            <strong>MOC ŁADUNKU:</strong> ${yieldKt} kT<br>
            <br>
            ${statusText}<br>
            <br>
            <strong>WARUNKI POGODOWE:</strong> Wiatr ${windSpeed} km/h (kierunek: ${windDir}°)<br>
            <br>
            <strong>OPIS SYTUACJI:</strong><br>
            ${damageText}<br>
            <br>
            <span style="font-size:0.7rem; color:#555;">[Wygenerowano przez: Nuclear Commander System]</span>
        `;
        
        reportBox.className = statusClass;
        reportBox.style.display = 'block';
        btnShare.style.display = 'block';
    }

    // --- Inicjalizacja kafelków uzbrojenia dla modułu przetrwania ---
    let activeSurvivalYield = 350;
    
    function initSurvivalArsenalUI() {
        const container = document.getElementById('survival-arsenal-container');
        if (!container) return;
        
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
                if (activeSurvivalYield === item.yield_kt) el.classList.add('selected');
                
                el.innerHTML = `
                    <div class="i-name">${item.name}</div>
                    <div class="i-yield">${item.yield_kt.toLocaleString()} kT</div>
                `;
                el.onclick = () => {
                    activeSurvivalYield = item.yield_kt;
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
                document.querySelectorAll('#survival-arsenal-container .arsenal-tab').forEach(t => t.classList.remove('active'));
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

    setTimeout(initSurvivalArsenalUI, 500);
});
