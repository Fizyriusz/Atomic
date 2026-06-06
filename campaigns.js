// campaigns.js - Silnik Kampanii Fabularnych (Techno-Thriller)

// ----------------------------------------------------
// DANE KAMPANII (Ground Truth)
// ----------------------------------------------------
window.campaignDb = [
    {
        id: "c1",
        title: "Kryzys Kubański (1962)",
        desc: "Jesień 1962. Świat wstrzymuje oddech. Podejmij decyzje jako głównodowodzący w USA.",
        difficulty: "ŚREDNIA",
        chapters: [
            {
                chapterId: 1,
                title: "ROZDZIAŁ 1: Oczy na niebie",
                text: "> 16 października 1962.\n> Panie Prezydencie, samoloty U-2 wróciły z misji. Mamy twarde dowody – budują wyrzutnie SS-4 w dżungli na Kubie. Jastrzębie w Pentagonie domagają się natychmiastowego uderzenia chirurgicznego, ale atak na radziecki personel to gwarantowana III Wojna Światowa.\n\nZADANIE: Znajdź lokalizację rakiet i wskaż cel dla blokady. Zaznacz cel w okolicach San Cristóbal na Kubie.",
                interactionMode: "locate",
                quests: [
                    { id: "find_base", desc: "Zlokalizuj wyrzutnie na Kubie (San Cristóbal)" }
                ],
                groundTruth: { lat: 22.71, lng: -83.03, radius: 100 },
                maxPts: 1000
            },
            {
                chapterId: 2,
                title: "ROZDZIAŁ 2: Kwarantanna",
                text: "> 22 października 1962.\n> Zdecydowaliśmy się na blokadę morską, nazywając ją dyplomatycznie 'kwarantanną'. Radzieckie frachtowce zbliżają się do naszej linii. Dowództwo chce ogłosić DEFCON 2.\n\nZADANIE: Podnieś poziom alertu w panelu bocznym. Następnie rozprosz lotnictwo strategiczne USA (B-2) w okolicach bazy MacDill na Florydzie, gotowe do natychmiastowego uderzenia.",
                interactionMode: "deploy",
                quests: [
                    { id: "defcon_2", desc: "Podnieś poziom alertu na DEFCON 2" },
                    { id: "deploy_bomber", desc: "Rozmieść lotnictwo na południu Florydy" }
                ],
                targetDefcon: 2,
                groundTruth: { lat: 27.84, lng: -82.48, radius: 150 },
                maxPts: 1000
            },
            {
                chapterId: 3,
                title: "ROZDZIAŁ 3: Czarna Sobota (Okręt B-59)",
                text: "> 27 października 1962. Zmiana perspektywy: Oficer Wasilij Archipow (ZSRR).\n> Nad Kubą zestrzelono amerykańskiego U-2. Równocześnie niszczyciele US Navy zrzucają granaty hukowe na twój okręt B-59. Kapitan chce strzelać.\n\nZADANIE: Zlokalizuj pozycję swojego okrętu na wodach międzynarodowych (wschód od Bahamów) i wybierz ładunek taktyczny (~10-25 kT) w panelu jako argument odstraszania.",
                interactionMode: "locate",
                quests: [
                    { id: "find_sub", desc: "Zlokalizuj B-59 na wschód od Bahamów" },
                    { id: "select_yield", desc: "Wybierz ładunek taktyczny (~10-25 kT)" }
                ],
                groundTruth: { lat: 24.00, lng: -70.00, radius: 300 },
                maxPts: 1000
            }
        ]
    },
    {
        id: "c2",
        title: "Able Archer '83",
        desc: "Operacja RJaN, paranoja i widmo inwazji. Zagraj jako analityk KGB.",
        difficulty: "TRUDNA",
        chapters: [
            {
                chapterId: 1,
                title: "ROZDZIAŁ 1: Widmo inwazji",
                text: "> 4 listopada 1983. Dowództwo KGB.\n> NATO zmienia szyfry i wstrzymuje ruch lotniczy w Europie. To mogą być przygotowania do uderzenia Pershing II. Politbiuro żąda reakcji.\n\nZADANIE: Skieruj lotnictwo radzieckie do uziemienia w bazach 16. Armii w okolicach Werneuchen (wschodnie Niemcy). Zaznacz tę strefę na mapie.",
                interactionMode: "locate",
                quests: [
                    { id: "locate_ddr", desc: "Zaznacz terytorium Niemiec Wschodnich (NRD)" }
                ],
                groundTruth: { lat: 52.63, lng: 13.76, radius: 200 },
                maxPts: 1000
            },
            {
                chapterId: 2,
                title: "ROZDZIAŁ 2: Żelazna Kurtyna",
                text: "> 7 listopada 1983. Napięcie sięga zenitu.\n> Ćwiczenia NATO symulują pełną salwę jądrową. Związek Radziecki stawia w stan gotowości siły powietrzne w NRD i Polsce.\n\nZADANIE: Narysuj na mapie linię obrony powietrznej (linię frontu) wzdłuż granicy NRD-RFN (Żelazna Kurtyna), aby zasygnalizować gotowość bojową na wypadek inwazji.",
                interactionMode: "draw_front",
                quests: [
                    { id: "draw_front", desc: "Narysuj linię frontu wzdłuż Żelaznej Kurtyny" }
                ],
                groundTruth: { lat: 52.00, lng: 10.50, radius: 250 },
                maxPts: 1000
            },
            {
                chapterId: 3,
                title: "ROZDZIAŁ 3: Sygnał deeskalacji",
                text: "> 11 listopada 1983. Ćwiczenia dobiegły końca.\n> Radzieckie dowództwo zdaje sobie sprawę, że to były tylko ćwiczenia, a nie realny atak. Musimy uniknąć przypadkowego wybuchu wojny.\n\nZADANIE: Zdeeskaluj napięcie w sztabie. Przywróć stan gotowości na DEFCON 5 w panelu bocznym oraz wskaż centrum dowodzenia w Moskwie na mapie.",
                interactionMode: "defcon",
                quests: [
                    { id: "defcon_5", desc: "Zmniejsz poziom alertu do DEFCON 5" },
                    { id: "locate_moscow", desc: "Zaznacz Moskwę na mapie" }
                ],
                targetDefcon: 5,
                groundTruth: { lat: 55.75, lng: 37.62, radius: 150 },
                maxPts: 1000
            }
        ]
    },
    {
        id: "c3",
        title: "Opcja Samsona",
        desc: "Październik 1973. Jom Kipur. Użyj ostatecznego argumentu dyplomatycznego.",
        difficulty: "EKSTREMALNA",
        chapters: [
            {
                chapterId: 1,
                title: "ROZDZIAŁ 1: Szantaż Dyplomatyczny",
                text: "> 9 października 1973. Zmiana dowództwa.\n> Fronty pękają, syryjskie czołgi są blisko przełamania na Golan. Potrzebujemy natychmiastowych dostaw broni z USA. Musimy wykreować odpowiednią sygnaturę termiczną, by ich satelity to zauważyły.\n\nZADANIE: Oznacz i zlokalizuj super-tajną bazę rakietową Sdot Micha w Izraelu, aby uzbroić pociski Jerycho.",
                interactionMode: "locate",
                quests: [
                    { id: "locate_base", desc: "Zlokalizuj bazę Sdot Micha w Izraelu" }
                ],
                groundTruth: { lat: 31.73, lng: 34.91, radius: 50 },
                maxPts: 1000
            },
            {
                chapterId: 2,
                title: "ROZDZIAŁ 2: Ogień na Synaju",
                text: "> 14 października 1973.\n> Podczas gdy amerykańskie mosty powietrzne (operacja Nickel Grass) ruszają na pomoc, na Synaju trwa gigantyczna bitwa pancerna. Musimy odeprzeć wojska egipskie.\n\nZADANIE: Narysuj linię frontu wzdłuż Kanału Sueskiego, reprezentującą izraelską linię obrony i blokadę natarcia.",
                interactionMode: "draw_front",
                quests: [
                    { id: "draw_sinai", desc: "Narysuj linię frontu wzdłuż Kanału Sueskiego" }
                ],
                groundTruth: { lat: 30.50, lng: 32.50, radius: 150 },
                maxPts: 1200
            },
            {
                chapterId: 3,
                title: "ROZDZIAŁ 3: Alert Mocarstw",
                text: "> 24 października 1973.\n> Związek Radziecki grozi jednostronnym wysłaniem wojsk do Egiptu. W odpowiedzi USA podnosi gotowość bojową swoich sił nuklearnych.\n\nZADANIE: Ustaw poziom zagrożenia na DEFCON 3 w panelu bocznym i oznacz centrum operacyjne w Tel Awiwie na mapie.",
                interactionMode: "defcon",
                quests: [
                    { id: "defcon_3", desc: "Ustaw gotowość na DEFCON 3" },
                    { id: "locate_telaviv", desc: "Zaznacz Tel Awiw na mapie" }
                ],
                targetDefcon: 3,
                groundTruth: { lat: 32.08, lng: 34.78, radius: 80 },
                maxPts: 1000
            }
        ]
    },
    {
        id: "c4",
        title: "Blef Przewodniczącego",
        desc: "Konflikt nad Ussuri (1969). Rozegraj wojnę psychologiczną jako strona chińska.",
        difficulty: "ŚREDNIA",
        chapters: [
            {
                chapterId: 1,
                title: "ROZDZIAŁ 1: Relokacja Dowództwa",
                text: "> Sierpień 1969. ZSRR grozi uderzeniem na nasz program nuklearny. Musimy ochronić dowództwo.\n\nZADANIE: Wskaż bezpieczną strefę w głębi Chin (np. góry w okolicach Syczuanu/Chongqing) jako cel relokacji dla kierownictwa Państwa Środka.",
                interactionMode: "locate",
                quests: [
                    { id: "relocate", desc: "Wskaż prowincję Syczuan (Chongqing)" }
                ],
                groundTruth: { lat: 29.5, lng: 106.5, radius: 300 },
                maxPts: 1000
            },
            {
                chapterId: 2,
                title: "ROZDZIAŁ 2: Teoria Szaleńca",
                text: "> Październik 1969. Musimy udowodnić, że nie zawahamy się wcisnąć guzika.\n\nZADANIE: Podnieś gotowość poligonu Lop Nur w Sinciangu. Rozstaw taktyczne głowice i wyczekuj. Oznacz to miejsce dla systemu wczesnego ostrzegania.",
                interactionMode: "locate",
                quests: [
                    { id: "locate_lopnur", desc: "Zlokalizuj poligon Lop Nur" }
                ],
                groundTruth: { lat: 40.1, lng: 89.5, radius: 150 },
                maxPts: 1000
            },
            {
                chapterId: 3,
                title: "ROZDZIAŁ 3: Spór graniczny nad Ussuri",
                text: "> Październik 1969. Rozpoczynają się rozmowy pokojowe.\n> Aby uniknąć dalszych starć granicznych w rejonie wyspy Żeniaobao, musimy precyzyjnie wytyczyć linię demarkacyjną na rzece.\n\nZADANIE: Narysuj na mapie linię demarkacyjną (front) wzdłuż rzeki Ussuri na granicy chińsko-radzieckiej.",
                interactionMode: "draw_front",
                quests: [
                    { id: "draw_ussuri", desc: "Narysuj granicę wzdłuż rzeki Ussuri" }
                ],
                groundTruth: { lat: 46.50, lng: 133.50, radius: 200 },
                maxPts: 1200
            }
        ]
    }
];

// ----------------------------------------------------
// STAN KAMPANII
// ----------------------------------------------------
let activeCampaignObj = null;
let currentChapterIndex = 0;
let totalCampaignScore = 0;
let campaignTypeInterval = null;
let campaignCoords = null; // Przechowuje kliknięcia w War Room
let campaignPolylinePoints = []; // Przechowuje punkty linii frontu
let campaignDefcon = 5;

// Inicjalizacja UI kampanii
function initCampaigns() {
    const list = document.getElementById('campaigns-list');
    if (!list) return;
    
    list.innerHTML = '';
    window.campaignDb.forEach(c => {
        const card = document.createElement('div');
        card.className = 'campaign-card';
        card.innerHTML = `
            <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="color:var(--blue); font-weight:bold; font-size:1.1rem;">${c.title}</span>
                    <span style="color:yellow; font-size:0.75rem; border:1px solid yellow; padding:2px 6px;">${c.difficulty}</span>
                </div>
                <p style="font-size:0.8rem; color:#aaa; line-height:1.4;">${c.desc}</p>
                <div style="font-size:0.7rem; color:#555; margin-top:10px;">ROZDZIAŁÓW: ${c.chapters.length}</div>
            </div>
            <button class="btn-action" style="padding:10px; margin-top:15px; font-size:0.85rem;" onclick="startCampaign('${c.id}')">URUCHOM KAMPANIĘ</button>
        `;
        list.appendChild(card);
    });
}

window.startCampaign = function(id) {
    activeCampaignObj = window.campaignDb.find(c => c.id === id);
    currentChapterIndex = 0;
    totalCampaignScore = 0;
    
    document.getElementById('campaigns-list').style.display = 'none';
    document.getElementById('campaign-crt-container').style.display = 'block';
    
    loadChapterUI();
};

function loadChapterUI() {
    if (!activeCampaignObj) return;
    const chapter = activeCampaignObj.chapters[currentChapterIndex];
    
    document.getElementById('crt-tv-title').innerText = `${activeCampaignObj.title} - ${chapter.title}`;
    const screen = document.getElementById('crt-tv-screen');
    screen.innerHTML = '';
    
    // Typing effect
    let text = chapter.text;
    let i = 0;
    if (campaignTypeInterval) clearInterval(campaignTypeInterval);
    
    campaignTypeInterval = setInterval(() => {
        screen.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
        i++;
        if (i >= text.length) clearInterval(campaignTypeInterval);
    }, 20); // Szybkość maszyny do pisania
}

window.closeCampaignCrt = function() {
    activeCampaignObj = null;
    document.getElementById('campaigns-list').style.display = 'grid';
    document.getElementById('campaign-crt-container').style.display = 'none';
    if (campaignTypeInterval) clearInterval(campaignTypeInterval);
}

// Przejście z ekranu narracji do War Room z listą questów
window.goToWarRoomForCampaign = function() {
    // 1. Zmień moduł na War Room
    window.switchModule('war');
    
    // 2. Skonfiguruj Quest Tracker
    const tracker = document.getElementById('quest-tracker');
    const qList = document.getElementById('quest-list');
    const chapter = activeCampaignObj.chapters[currentChapterIndex];
    
    document.getElementById('quest-title').innerText = `${activeCampaignObj.title.toUpperCase()} (ETAP ${currentChapterIndex+1})`;
    qList.innerHTML = chapter.quests.map(q => `
        <div class="quest-item" id="quest-item-${q.id}">
            <div class="quest-box" id="quest-box-${q.id}"></div>
            <span>${q.desc}</span>
        </div>
    `).join('');
    
    tracker.style.display = 'block';
    
    // Zresetuj koordynaty śledzenia
    campaignCoords = null;
    campaignPolylinePoints = [];
    
    // Uruchomienie trybu interakcji na mapie
    if (typeof window.setCampaignInteractionMode === 'function') {
        window.setCampaignInteractionMode(chapter.interactionMode);
    }
}

window.abortCampaign = function() {
    document.getElementById('quest-tracker').style.display = 'none';
    activeCampaignObj = null;
    window.switchModule('missions');
    closeCampaignCrt();
    
    if (typeof window.setCampaignInteractionMode === 'function') {
        window.setCampaignInteractionMode(null);
    }
    
    alert("Przerwano kampanię. Powrót do bazy.");
}

// Obliczanie dystansu między współrzędnymi geograficznymi (Haversine)
function getDistanceKM(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

// API dla war_room.js do zgłaszania akcji
window.notifyCampaignAction = function(actionType, data) {
    if (!activeCampaignObj) return;
    const chapter = activeCampaignObj.chapters[currentChapterIndex];
    
    if (actionType === 'map_click') {
        campaignCoords = { lat: data.lat, lng: data.lng };
        
        // Zaznacz questy wyszukiwania / lokalizacji
        const findQuests = chapter.quests.filter(q => q.id.includes('find') || q.id.includes('locate') || q.id.includes('deploy') || q.id.includes('relocate'));
        findQuests.forEach(q => {
            const el = document.getElementById(`quest-box-${q.id}`);
            if (el) el.classList.add('done');
        });
    }
    
    if (actionType === 'draw_click') {
        campaignPolylinePoints = data;
        const drawQuests = chapter.quests.filter(q => q.id.includes('draw') || q.id.includes('front') || q.id.includes('line') || q.id.includes('sinai') || q.id.includes('ussuri'));
        drawQuests.forEach(q => {
            const el = document.getElementById(`quest-box-${q.id}`);
            if (el) el.classList.add('done');
        });
    }
    
    if (actionType === 'draw_clear') {
        campaignPolylinePoints = [];
        const drawQuests = chapter.quests.filter(q => q.id.includes('draw') || q.id.includes('front') || q.id.includes('line') || q.id.includes('sinai') || q.id.includes('ussuri'));
        drawQuests.forEach(q => {
            const el = document.getElementById(`quest-box-${q.id}`);
            if (el) el.classList.remove('done');
        });
    }
    
    if (actionType === 'defcon_change') {
        campaignDefcon = data;
        const q = chapter.quests.find(q => q.id.includes('defcon'));
        if (q) {
            const target = chapter.targetDefcon || 2;
            const el = document.getElementById(`quest-box-${q.id}`);
            if (el) {
                if (data === target) {
                    el.classList.add('done');
                } else {
                    el.classList.remove('done');
                }
            }
        }
    }
    
    if (actionType === 'yield_change') {
        const q = chapter.quests.find(q => q.id === 'select_yield');
        if (q && data <= 25) {
            const el = document.getElementById(`quest-box-${q.id}`);
            if (el) el.classList.add('done');
        }
    }
}

window.submitQuest = function() {
    if (!activeCampaignObj) return;
    
    const chapter = activeCampaignObj.chapters[currentChapterIndex];
    let score = 0;
    
    if (chapter.interactionMode === 'draw_front') {
        if (!campaignPolylinePoints || campaignPolylinePoints.length < 2) {
            alert("BŁĄD: Musisz narysować linię frontu na mapie!");
            return;
        }
        
        // Oblicz najmniejszą odległość od narysowanej linii do groundTruth
        let minDist = Infinity;
        campaignPolylinePoints.forEach(p => {
            const dist = getDistanceKM(p.lat, p.lng, chapter.groundTruth.lat, chapter.groundTruth.lng);
            if (dist < minDist) minDist = dist;
        });
        
        if (minDist <= chapter.groundTruth.radius) {
            score = chapter.maxPts;
        } else if (minDist <= chapter.groundTruth.radius * 3) {
            score = Math.floor(chapter.maxPts * (1 - (minDist / (chapter.groundTruth.radius * 3))));
        } else {
            score = 0;
        }
        
        totalCampaignScore += score;
        let msg = `Oceniono przebieg linii frontu.\nNajbliższy punkt Twojej linii znajduje się ${Math.floor(minDist)} km od strefy krytycznej.\nZdobyto punktów: ${score}/${chapter.maxPts}\n\n`;
        
        if (score === 0) {
            msg += "Porażka! Linia frontu przebiega zbyt daleko od celu historycznego. Wróg przełamał obronę. Koniec kampanii.";
            alert(msg);
            abortCampaign();
            return;
        }
        
        alert(msg + "Przechodzimy do kolejnego etapu...");
        
    } else if (chapter.interactionMode === 'defcon') {
        const target = chapter.targetDefcon || 2;
        if (campaignDefcon !== target) {
            alert(`BŁĄD: Musisz ustawić alert na DEFCON ${target} w panelu bocznym!`);
            return;
        }
        
        if (chapter.groundTruth && !campaignCoords) {
            alert("BŁĄD: Musisz dodatkowo zaznaczyć na mapie pozycję dowodzenia/sztabu!");
            return;
        }
        
        let dist = 0;
        if (chapter.groundTruth) {
            dist = getDistanceKM(campaignCoords.lat, campaignCoords.lng, chapter.groundTruth.lat, chapter.groundTruth.lng);
            if (dist <= chapter.groundTruth.radius) {
                score = chapter.maxPts;
            } else if (dist <= chapter.groundTruth.radius * 3) {
                score = Math.floor(chapter.maxPts * (1 - (dist / (chapter.groundTruth.radius * 3))));
            } else {
                score = 0;
            }
        } else {
            score = chapter.maxPts;
        }
        
        totalCampaignScore += score;
        let msg = `Oceniono poprawność rozkazu.\nOdległość od celu: ${Math.floor(dist)} km. Ustawiony DEFCON: ${campaignDefcon}.\nZdobyto punktów: ${score}/${chapter.maxPts}\n\n`;
        
        if (score === 0) {
            msg += "Porażka! Błąd taktyczny lub zła lokalizacja punktu na mapie. Koniec kampanii.";
            alert(msg);
            abortCampaign();
            return;
        }
        
        alert(msg + "Przechodzimy do kolejnego etapu...");
        
    } else {
        // locate lub deploy
        if (!campaignCoords) {
            alert("BŁĄD: Musisz wskazać lokację operacyjną na mapie!");
            return;
        }
        
        const dist = getDistanceKM(campaignCoords.lat, campaignCoords.lng, chapter.groundTruth.lat, chapter.groundTruth.lng);
        
        if (dist <= chapter.groundTruth.radius) {
            score = chapter.maxPts;
        } else if (dist <= chapter.groundTruth.radius * 3) {
            score = Math.floor(chapter.maxPts * (1 - (dist / (chapter.groundTruth.radius * 3))));
        } else {
            score = 0;
        }
        
        totalCampaignScore += score;
        let msg = `Oceniono precyzję operacyjną.\nOdległość od idealnego celu: ${Math.floor(dist)} km.\nZdobyto punktów: ${score}/${chapter.maxPts}\n\n`;
        
        if (score === 0) {
            msg += "Porażka! Błąd taktyczny o katastrofalnych skutkach. Koniec kampanii.";
            alert(msg);
            abortCampaign();
            return;
        }
        
        alert(msg + "Przechodzimy do kolejnego etapu...");
    }
    
    document.getElementById('quest-tracker').style.display = 'none';
    if (typeof window.setCampaignInteractionMode === 'function') {
        window.setCampaignInteractionMode(null);
    }
    
    currentChapterIndex++;
    if (currentChapterIndex >= activeCampaignObj.chapters.length) {
        alert(`KAMPANIA ZAKOŃCZONA SUKCESEM!\nCałkowity Wynik: ${totalCampaignScore} pkt.\nHistoria potoczyła się tak, jak powinna.`);
        activeCampaignObj = null;
        window.switchModule('missions');
        closeCampaignCrt();
    } else {
        window.switchModule('missions');
        loadChapterUI();
    }
}

// Inicjalizacja opóźniona
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCampaigns, 500);
});
