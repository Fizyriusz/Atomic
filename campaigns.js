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
                text: "> 16 października 1962.\n> Panie Prezydencie, samoloty U-2 wróciły z misji. Mamy twarde dowody – budują wyrzutnie SS-4 w dżungli na Kubie. Jastrzębie w Pentagonie domagają się natychmiastowego uderzenia chirurgicznego, ale atak na radziecki personel to gwarantowana III Wojna Światowa.\n\nZADANIE: Znajdź lokalizację rakiet i wskaż cel dla blokady. Rozmieść okręt (lub oznacz cel) w okolicach San Cristóbal. Nie odpalaj rakiet!",
                quests: [
                    { id: "find_base", desc: "Zlokalizuj wyrzutnie na Kubie (San Cristóbal)" },
                    { id: "no_fire", desc: "Nie inicjuj zapłonu (wstrzymaj ogień)" }
                ],
                groundTruth: { lat: 22.71, lng: -83.03, radius: 50 },
                maxPts: 1000
            },
            {
                chapterId: 2,
                title: "ROZDZIAŁ 2: Kwarantanna",
                text: "> 22 października 1962.\n> Zdecydowaliśmy się na blokadę morską, nazywając ją dyplomatycznie 'kwarantanną'. Radzieckie frachtowce zbliżają się do naszej linii. Dowództwo chce ogłosić DEFCON 2.\n\nZADANIE: Podnieś poziom alertu. Rozprosz lotnictwo strategiczne USA (B-2) w okolicach bazy MacDill na Florydzie, gotowe do natychmiastowego uderzenia.",
                quests: [
                    { id: "defcon_2", desc: "Podnieś poziom alertu na DEFCON 2" },
                    { id: "deploy_bomber", desc: "Rozmieść lotnictwo na południu Florydy" }
                ],
                groundTruth: { lat: 27.84, lng: -82.48, radius: 100 },
                maxPts: 1000
            },
            {
                chapterId: 3,
                title: "ROZDZIAŁ 3: Czarna Sobota (Okręt B-59)",
                text: "> 27 października 1962. Zmiana perspektywy: Oficer Wasilij Archipow (ZSRR).\n> Nad Kubą zestrzelono amerykańskiego U-2. Równocześnie niszczyciele US Navy zrzucają granaty hukowe na twój okręt B-59. Kapitan chce strzelać.\n\nZADANIE: Zlokalizuj pozycję swojego okrętu na wodach międzynarodowych (wschód od Bahamów) i odrzuć rozkaz odpalenia głowicy taktycznej 10 kT.",
                quests: [
                    { id: "find_sub", desc: "Zlokalizuj B-59 na wschód od Bahamów" },
                    { id: "select_yield", desc: "Wybierz ładunek taktyczny (~10-20 kT)" }
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
                quests: [
                    { id: "locate_ddr", desc: "Zaznacz terytorium Niemiec Wschodnich (NRD)" }
                ],
                groundTruth: { lat: 52.63, lng: 13.76, radius: 200 },
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
                text: "> 9 października 1973. Zmiana dowództwa.\n> Fronty pękają, potrzebujemy broni z USA. Musimy wykreować odpowiednią sygnaturę termiczną, by ich satelity to zauważyły.\n\nZADANIE: Uzbrój i rozstaw wyrzutnie ICBM z lekkimi ładunkami taktycznymi w super-tajnej bazie Sdot Micha w Izraelu. Nie odpalaj ich!",
                quests: [
                    { id: "locate_base", desc: "Zlokalizuj bazę Sdot Micha w Izraelu" },
                    { id: "no_fire", desc: "Brak odpalenia (oczekiwanie na logistykę)" }
                ],
                groundTruth: { lat: 31.73, lng: 34.91, radius: 50 },
                maxPts: 1500
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
                quests: [
                    { id: "relocate", desc: "Wskaż zachodnie/centralne Chiny (Z dala od Pekinu)" }
                ],
                groundTruth: { lat: 29.5, lng: 106.5, radius: 400 },
                maxPts: 1000
            },
            {
                chapterId: 2,
                title: "ROZDZIAŁ 2: Teoria Szaleńca",
                text: "> Październik 1969. Musimy udowodnić, że nie zawahamy się wcisnąć guzika.\n\nZADANIE: Podnieś gotowość poligonu Lop Nur w Sinciangu. Rozstaw taktyczne głowice i wyczekuj. Oznacz to miejsce dla systemu wczesnego ostrzegania.",
                quests: [
                    { id: "locate_lopnur", desc: "Zlokalizuj poligon Lop Nur" }
                ],
                groundTruth: { lat: 40.1, lng: 89.5, radius: 100 },
                maxPts: 1500
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
}

window.abortCampaign = function() {
    document.getElementById('quest-tracker').style.display = 'none';
    activeCampaignObj = null;
    window.switchModule('missions');
    closeCampaignCrt();
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
        
        // Czysto wizualne checki (np. "znajdź coś na mapie")
        const findQuests = chapter.quests.filter(q => q.id.includes('find') || q.id.includes('locate') || q.id.includes('deploy') || q.id.includes('relocate'));
        findQuests.forEach(q => {
            document.getElementById(`quest-box-${q.id}`).classList.add('done');
        });
    }
    
    if (actionType === 'defcon_change') {
        campaignDefcon = data;
        const q = chapter.quests.find(q => q.id === 'defcon_2');
        if (q && data === 2) document.getElementById(`quest-box-${q.id}`).classList.add('done');
    }
    
    if (actionType === 'yield_change') {
        const q = chapter.quests.find(q => q.id === 'select_yield');
        if (q && data <= 25) document.getElementById(`quest-box-${q.id}`).classList.add('done');
    }
}

window.submitQuest = function() {
    if (!activeCampaignObj) return;
    
    const chapter = activeCampaignObj.chapters[currentChapterIndex];
    let score = 0;
    
    if (!campaignCoords) {
        alert("BŁĄD: Musisz wskazać lokację operacyjną na mapie (Ustaw cel/bazę)!");
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
    document.getElementById('quest-tracker').style.display = 'none';
    
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
