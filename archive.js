// archive.js - Moduł 5: Krawędź Zagłady (Archiwum Incydentów)

let archiveActiveChart = null;
let petrovTimerInterval = null;

function initArchive() {
    renderArchiveDashboard();
}

function clearArchive() {
    if (archiveActiveChart) {
        archiveActiveChart.destroy();
        archiveActiveChart = null;
    }
    if (petrovTimerInterval) {
        clearInterval(petrovTimerInterval);
        petrovTimerInterval = null;
    }
    document.getElementById('archive-container').innerHTML = '';
}

function renderArchiveDashboard() {
    clearArchive();
    const container = document.getElementById('archive-container');
    
    let html = `
        <div style="text-align:center; max-width:800px; margin:0 auto 30px auto;">
            <h2 class="glow-text-red" style="font-size:1.8rem; margin-bottom:10px;">AKTA INCYDENTÓW</h2>
            <p style="color:#aaa; font-size:0.9rem;">${window.archiveDb.intro}</p>
        </div>
        <div class="archive-grid">
    `;

    window.archiveDb.incidents.forEach(inc => {
        html += `
            <div class="archive-card" onclick="loadArchiveScenario('${inc.id}')">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                    <span class="a-year">${inc.year}</span>
                    <span style="color:#888; font-size:0.7rem; text-transform:uppercase;">${inc.type}</span>
                </div>
                <h3 style="color:#eee; margin:0 0 10px 0;">${inc.title}</h3>
                <p style="color:#888; font-size:0.8rem; flex-grow:1; margin-bottom:15px;">${inc.desc}</p>
                <div style="display:flex; gap:5px; flex-wrap:wrap;">
                    ${inc.tags.map(t => `<span style="background:#222; color:#00ff41; padding:2px 5px; font-size:0.7rem;">${t}</span>`).join('')}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

window.loadArchiveScenario = function(id) {
    clearArchive();
    const container = document.getElementById('archive-container');
    const incident = window.archiveDb.incidents.find(i => i.id === id);

    let headerHtml = `
        <button class="btn-action" style="width:auto; padding:5px 15px; font-size:0.8rem; margin-bottom:20px;" onclick="renderArchiveDashboard()">← POWRÓT DO AKT</button>
        <div class="archive-header">
            <h2>${incident.title} <span style="color:#aaa; font-size:1.2rem;">(${incident.year})</span></h2>
            <p>${incident.desc}</p>
        </div>
    `;
    container.innerHTML = headerHtml;

    switch(id) {
        case 'kuba': renderArchiveKuba(container); break;
        case 'pietrow': renderArchivePietrow(container); break;
        case 'hiroshima': renderArchiveHiroshima(container); break;
        case 'ablearcher': renderArchiveGeneric(container, id, true); break;
        case 'jomkipur': renderArchiveGeneric(container, id, false); break;
        case 'norwegia': renderArchiveGeneric(container, id, false); break;
    }
}

function renderArchiveKuba(container) {
    const data = window.archiveDb.details.kuba.timeline;
    
    let html = `
        <div style="display:flex; gap:20px; flex-wrap:wrap;">
            <div style="flex:1; min-width:250px; max-height:500px; overflow-y:auto; background:#111; padding:10px; border:1px solid #333;">
                <h3 style="color:#00ccff; font-size:0.9rem; margin-top:0;">OŚ CZASU KRYZYSU</h3>
                <div id="kuba-days-list"></div>
            </div>
            <div style="flex:2; min-width:300px; display:flex; flex-direction:column; gap:20px;">
                <div style="background:rgba(0,0,0,0.8); border:1px solid var(--red); padding:20px;">
                    <h4 id="kuba-day-title" style="color:var(--red); margin-top:0;"></h4>
                    <p id="kuba-day-text" style="color:#ccc; line-height:1.5; font-size:0.9rem;"></p>
                </div>
                <div style="background:rgba(0,0,0,0.8); border:1px solid #333; padding:20px;">
                    <h4 style="color:#aaa; text-align:center; margin-top:0;">NAPIĘCIE / RYZYKO ESKALACJI</h4>
                    <div class="chart-container" style="height:250px;"><canvas id="kubaChart"></canvas></div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML += html;

    const list = document.getElementById('kuba-days-list');
    data.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-action';
        btn.style.width = '100%';
        btn.style.textAlign = 'left';
        btn.style.marginBottom = '5px';
        btn.style.padding = '10px';
        btn.innerHTML = `<span style="color:var(--green)">Dz. ${item.day}</span> <span style="color:#888; font-size:0.7rem;">${item.date}</span>`;
        btn.onclick = () => updateArchiveKubaDay(index);
        list.appendChild(btn);
    });

    const ctx = document.getElementById('kubaChart').getContext('2d');
    archiveActiveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => `Dz. ${d.day}`),
            datasets: [{
                label: 'Napięcie (%)',
                data: data.map(d => d.tension),
                borderColor: '#ff2a2a',
                backgroundColor: 'rgba(255, 42, 42, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: data.map((d, i) => i === 0 ? '#ff2a2a' : '#222'),
                pointRadius: 5
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { 
                y: { min: 0, max: 100, ticks: { color: '#888' }, grid: { color: '#222' } },
                x: { ticks: { color: '#888' }, grid: { color: '#222' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    updateArchiveKubaDay(0);
}

function updateArchiveKubaDay(index) {
    const data = window.archiveDb.details.kuba.timeline;
    document.getElementById('kuba-day-title').innerText = `Dzień ${data[index].day} (${data[index].date})`;
    document.getElementById('kuba-day-text').innerText = data[index].text;
    
    if (archiveActiveChart) {
        archiveActiveChart.data.datasets[0].pointBackgroundColor = data.map((_, i) => i === index ? '#ff2a2a' : '#222');
        archiveActiveChart.update();
    }
}

function renderArchivePietrow(container) {
    const logs = window.archiveDb.details.pietrow.logs;
    
    let html = `
        <div style="max-width:800px; margin:0 auto;">
            <div class="crt-radar-container">
                <div class="console-logs" id="pietrow-logs"></div>
                <div style="display:flex; flex-direction:column; align-items:center; opacity:0; transition:1s;" id="pietrow-radar">
                    <div class="radar-ui"></div>
                    <div style="color:var(--red); font-weight:bold; margin-top:10px; text-shadow:0 0 10px var(--red);" class="blink">CEL: ZSRR</div>
                </div>
            </div>
            <div id="pietrow-decision" style="opacity:0; transition:0.5s; margin-top:20px; background:#111; padding:20px; border:1px solid #333;">
                <p style="color:var(--red); font-weight:bold;">> DECYZJA DOWÓDCY. CZAS: <span id="pietrow-time">12:00</span></p>
                <div style="display:flex; gap:10px;">
                    <button class="btn-action glow-text-red" style="border-color:var(--red); color:var(--red);" onclick="petrovAction('attack')">ZGŁOŚ ATAK (ODWET)</button>
                    <button class="btn-action" style="border-color:var(--green); color:var(--green);" onclick="petrovAction('ignore')">ZIGNORUJ (BŁĄD)</button>
                </div>
            </div>
        </div>
    `;
    container.innerHTML += html;

    let logIndex = 0;
    const logBox = document.getElementById('pietrow-logs');
    
    const typeLog = () => {
        if (logIndex < logs.length) {
            const p = document.createElement('p');
            if (logs[logIndex].includes("ALARM")) p.style.color = 'var(--red)';
            p.innerText = `> ${logs[logIndex]}`;
            logBox.appendChild(p);
            
            if (logIndex === 4) {
                document.getElementById('pietrow-radar').style.opacity = '1';
            }
            logIndex++;
            setTimeout(typeLog, 800);
        } else {
            document.getElementById('pietrow-decision').style.opacity = '1';
            startPetrovTimer(12, 0);
        }
    };
    setTimeout(typeLog, 500);
}

function startPetrovTimer(min, sec) {
    let time = min * 60 + sec;
    const display = document.getElementById('pietrow-time');
    petrovTimerInterval = setInterval(() => {
        time--;
        let m = Math.floor(time / 60);
        let s = time % 60;
        display.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (time <= 0) {
            clearInterval(petrovTimerInterval);
            display.innerText = "UDERZENIE";
        }
    }, 1000);
}

window.petrovAction = function(choice) {
    clearInterval(petrovTimerInterval);
    const panel = document.getElementById('pietrow-decision');
    if (choice === 'attack') {
        panel.innerHTML = `<div style="background:rgba(255,0,0,0.2); padding:15px; border:1px solid var(--red); color:var(--red); text-align:center;">
            <strong>Zgłoszono atak. Procedura odwetowa uruchomiona. Symulowany koniec świata.</strong><br>
            W rzeczywistości system błędnie zinterpretował odbicie słońca od chmur wyższego piętra.
        </div>`;
    } else {
        panel.innerHTML = `<div style="background:rgba(0,255,0,0.1); padding:15px; border:1px solid var(--green); color:var(--green); text-align:center;">
            <strong>Decyzja: Błąd systemu. Napięcie opada.</strong><br>
            Pietrow uratował świat, dedukując, że prawdziwy atak z USA byłby zmasowany, a nie składał się z zaledwie pięciu rakiet.
        </div>`;
    }
}

function renderArchiveHiroshima(container) {
    const data = window.archiveDb.details.hiroshima.yieldData;
    let html = `
        <div style="display:flex; gap:20px; flex-wrap:wrap;">
            <div style="flex:1; min-width:300px; background:#111; padding:20px; border:1px solid #333;">
                <h3 style="color:#eee; margin-top:0;">Potęga Destrukcji</h3>
                <p style="color:#aaa; font-size:0.9rem;">Bomby zrzucone na Hiroszimę (Little Boy) i Nagasaki (Fat Man) pochłonęły natychmiast dziesiątki tysięcy istnień. Jednak w kontekście późniejszego wyścigu zbrojeń zimnej wojny, ich moc wydaje się wręcz "mikroskopijna".</p>
                <div style="margin-top:20px; padding:15px; border-left:4px solid var(--red); background:rgba(255,0,0,0.1); font-size:0.85rem; color:#ccc;">
                    <strong>Hiroszima (15 kt):</strong> Całkowite zniszczenie w promieniu ~1.6 km, fala cieplna wywołująca oparzenia 3. stopnia w promieniu niemal 2 km.
                </div>
            </div>
            <div style="flex:1; min-width:300px; background:#111; padding:20px; border:1px solid #333;">
                <h4 style="text-align:center; color:#888; margin-top:0;">PORÓWNANIE MOCY (SKALA LOGARYTMICZNA)</h4>
                <div class="chart-container"><canvas id="yieldChart"></canvas></div>
            </div>
        </div>
    `;
    container.innerHTML += html;

    const ctx = document.getElementById('yieldChart').getContext('2d');
    archiveActiveChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: { 
                    type: 'logarithmic', 
                    ticks: { color: '#888' }, grid: { color: '#222' } 
                },
                y: { ticks: { color: '#ccc', font: {size: 10} }, grid: { display: false } }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: c => c.raw.toLocaleString('pl-PL') + ' kt' } }
            }
        }
    });
}

function renderArchiveGeneric(container, id, withChart) {
    const data = window.archiveDb.details[id];
    let html = `
        <div style="background:#111; padding:25px; border:1px solid #333; max-width:800px; margin:0 auto; font-size:1rem; line-height:1.6; color:#ccc;">
            ${data.text.replace(/\n/g, '<br>')}
        </div>
    `;

    if (withChart && data.tensionData) {
        html += `
            <div style="background:#111; padding:20px; border:1px solid #333; max-width:800px; margin:20px auto 0 auto;">
                <h4 style="text-align:center; color:#888; margin-top:0;">RYZYKO WYBUCHU WOJNY (%)</h4>
                <div class="chart-container"><canvas id="genericChart"></canvas></div>
            </div>
        `;
    }
    container.innerHTML += html;

    if (withChart && data.tensionData) {
        const ctx = document.getElementById('genericChart').getContext('2d');
        archiveActiveChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.tensionData.map((_, i) => `Faza ${i+1}`),
                datasets: [{
                    label: 'Ryzyko %',
                    data: data.tensionData,
                    borderColor: '#facc15',
                    backgroundColor: 'rgba(250, 204, 21, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { 
                    y: { min: 0, max: 100, ticks: { color: '#888' }, grid: { color: '#222' } },
                    x: { ticks: { color: '#888' }, grid: { color: '#222' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

// Inicjalizacja opóźniona
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initArchive, 500);
});
