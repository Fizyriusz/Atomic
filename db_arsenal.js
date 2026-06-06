// db_arsenal.js - Zunifikowana Baza Danych o broni jądrowej i incydentach

window.nuclearData = [
    {
        "id": "USA_001",
        "name": "Trinity (Gadget)",
        "country": "USA",
        "yield_kt": 21,
        "year": 1945,
        "category": "Milestones",
        "short_desc": "Pierwsza w historii udana detonacja bomby nuklearnej, która na pustyni w Nowym Meksyku brutalnie rozpoczęła erę atomową."
    },
    {
        "id": "USA_002",
        "name": "Little Boy",
        "country": "USA",
        "yield_kt": 15,
        "year": 1945,
        "category": "Milestones",
        "short_desc": "Zrzucana na Hiroszimę uranowa bomba działowa. Pierwsza broń jądrowa kiedykolwiek użyta w walce, zmieniająca oblicze wojen na zawsze."
    },
    {
        "id": "USA_003",
        "name": "Fat Man",
        "country": "USA",
        "yield_kt": 21,
        "year": 1945,
        "category": "Milestones",
        "short_desc": "Plutonowa bomba implozyjna zrzucona na Nagasaki. Jej skomplikowana budowa stała się wzorem dla przyszłych arsenałów na całym świecie."
    },
    {
        "id": "USSR_001",
        "name": "RDS-1 (Pierwaja Mołnija)",
        "country": "ZSRR/Rosja",
        "yield_kt": 22,
        "year": 1949,
        "category": "Milestones",
        "short_desc": "Pierwsza radziecka bomba atomowa. Jej detonacja zszokowała Zachód, udowadniając, że Amerykanie stracili monopol na broń ostateczną."
    },
    {
        "id": "USA_004",
        "name": "Ivy Mike",
        "country": "USA",
        "yield_kt": 10400,
        "year": 1952,
        "category": "Milestones",
        "short_desc": "Monstrum wczesnej technologii. Pierwsza na świecie bomba wodorowa, która po prostu wyparowała z powierzchni oceanu całą wyspę Elugelab."
    },
    {
        "id": "USSR_002",
        "name": "RDS-37",
        "country": "ZSRR/Rosja",
        "yield_kt": 1600,
        "year": 1955,
        "category": "Milestones",
        "short_desc": "Pierwsza radziecka, dwustopniowa bomba termojądrowa zdolna do zrzutu z samolotu. Prawdziwy początek strategicznego wyścigu."
    },
    {
        "id": "USSR_003",
        "name": "Car Bomba (RDS-220)",
        "country": "ZSRR/Rosja",
        "yield_kt": 50000,
        "year": 1961,
        "category": "Milestones",
        "short_desc": "Największa zdetonowana bomba w historii. Jej fala uderzeniowa okrążyła Ziemię 3 razy, a błysk był widoczny z odległości 1000 kilometrów."
    },
    {
        "id": "USA_005",
        "name": "B61",
        "country": "USA",
        "yield_kt": 340,
        "year": 1968,
        "category": "Tactical",
        "short_desc": "Podstawowa bomba grawitacyjna NATO z regulowaną siłą wybuchu. Niewielka, uniwersalna i do dziś spoczywająca w europejskich hangarach."
    },
    {
        "id": "USA_006",
        "name": "W76",
        "country": "USA",
        "yield_kt": 100,
        "year": 1978,
        "category": "Strategic",
        "short_desc": "Cichy zabójca głębin. Głowica masowo instalowana na pociskach Trident, przenoszonych przez potężne, amerykańskie okręty podwodne."
    },
    {
        "id": "USA_007",
        "name": "W87",
        "country": "USA",
        "yield_kt": 300,
        "year": 1986,
        "category": "Strategic",
        "short_desc": "Niezwykle precyzyjna głowica z rakiet Minuteman III, ukrytych w silosach rozrzuconych po równinach Stanów Zjednoczonych."
    },
    {
        "id": "USA_008",
        "name": "W88",
        "country": "USA",
        "yield_kt": 475,
        "year": 1989,
        "category": "Strategic",
        "short_desc": "Uznawana za najbardziej zaawansowaną i zminiaturyzowaną głowicę w arsenale USA, zdolna zmieścić gigantyczną moc w małym stożku."
    },
    {
        "id": "USSR_004",
        "name": "R-36M (SS-18 Satan)",
        "country": "ZSRR/Rosja",
        "yield_kt": 20000,
        "year": 1974,
        "category": "Strategic",
        "short_desc": "Najpotężniejszy pocisk międzykontynentalny świata. Budził taki popłoch na Zachodzie, że planiści NATO nadali mu oficjalny przydomek 'Szatan'."
    },
    {
        "id": "USSR_005",
        "name": "Topol-M (Głowica)",
        "country": "ZSRR/Rosja",
        "yield_kt": 800,
        "year": 1997,
        "category": "Strategic",
        "short_desc": "Podstawowa broń współczesnych, mobilnych wyrzutni rosyjskich, przemierzających ukradkiem syberyjskie lasy."
    },
    {
        "id": "CHN_001",
        "name": "DF-41 (Głowica)",
        "country": "Chiny",
        "yield_kt": 1000,
        "year": 2017,
        "category": "Strategic",
        "short_desc": "Najnowocześniejsza chluba chińskiego arsenału. Potężny pocisk drogowy z systemem MIRV, mogący uderzyć w każdy punkt na Ziemi."
    },
    {
        "id": "CHN_002",
        "name": "Test No. 6",
        "country": "Chiny",
        "yield_kt": 3300,
        "year": 1967,
        "category": "Milestones",
        "short_desc": "Pierwsza chińska bomba wodorowa. Udowodniła szokująco szybki postęp naukowy Pekinu, raptem 3 lata po ich pierwszej zwykłej bombie."
    },
    {
        "id": "FRA_001",
        "name": "Gerboise Bleue",
        "country": "Francja",
        "yield_kt": 70,
        "year": 1960,
        "category": "Milestones",
        "short_desc": "Błękitny Skoczek Pustynny. Pierwszy francuski test nuklearny przeprowadzony w sercu algierskiej Sahary, wciągający Paryż do atomowego klubu."
    },
    {
        "id": "FRA_002",
        "name": "TN 75",
        "country": "Francja",
        "yield_kt": 110,
        "year": 1996,
        "category": "Strategic",
        "short_desc": "Niewidzialna tarcza republiki. Zminiaturyzowana głowica termojądrowa ukryta głęboko w trzewiach francuskich okrętów podwodnych klasy Triomphant."
    },
    {
        "id": "FRA_003",
        "name": "ASMP-A",
        "country": "Francja",
        "yield_kt": 300,
        "year": 2009,
        "category": "Tactical",
        "short_desc": "Naddźwiękowy pocisk manewrujący z głowicą nuklearną. Przenoszony przez myśliwce Rafale jako ostateczne 'ostrzeżenie' przed atakiem na pełną skalę."
    },
    {
        "id": "UK_001",
        "name": "Operation Hurricane",
        "country": "Wielka Brytania",
        "yield_kt": 25,
        "year": 1952,
        "category": "Milestones",
        "short_desc": "Brytyjski debiut nuklearny. Ładunek potajemnie zdetonowano wewnątrz starej fregaty u wybrzeży Australii, sprawdzając skutki przemytu bomby statkiem."
    },
    {
        "id": "UK_002",
        "name": "WE.177",
        "country": "Wielka Brytania",
        "yield_kt": 450,
        "year": 1966,
        "category": "Tactical",
        "short_desc": "Główny oręż taktyczny lotnictwa Królewskiego z czasów zimnej wojny, zaplanowany do niszczenia radzieckich kolumn pancernych w Europie."
    },
    {
        "id": "IND_001",
        "name": "Uśmiechnięty Budda",
        "country": "Indie",
        "yield_kt": 12,
        "year": 1974,
        "category": "Milestones",
        "short_desc": "Ściśle tajny indyjski test o ironicznym kryptonimie. Wstrząsnął światową dyplomacją i zapoczątkował niebezpieczny wyścig zbrojeń w Azji Południowej."
    },
    {
        "id": "PAK_001",
        "name": "Chagai-I",
        "country": "Pakistan",
        "yield_kt": 40,
        "year": 1998,
        "category": "Milestones",
        "short_desc": "Pospieszna, ale stanowcza odpowiedź Pakistanu na testy Indii. Seria detonacji głęboko pod czerwoną górą w Beludżystanie wyrównała siły w regionie."
    },
    {
        "id": "PRK_001",
        "name": "Hwasong-15 (Głowica)",
        "country": "Korea Płn.",
        "yield_kt": 250,
        "year": 2017,
        "category": "Strategic",
        "short_desc": "Głowica potężnej rakiety, która udowodniła ponad wszelką wątpliwość, że izolowany reżim w Pjongjangu potrafi dosięgnąć kontynentalnego terytorium USA."
    },
    {
        "id": "USA_009",
        "name": "Davy Crockett (M388)",
        "country": "USA",
        "yield_kt": 0.02,
        "year": 1961,
        "category": "Tactical",
        "short_desc": "Miniaturowy pocisk nuklearny wystrzeliwany z działa bezodrzutowego na statywie. Miał tak mały zasięg, że śmiertelnie zagrażał własnej załodze."
    },
    {
        "id": "USSR_006",
        "name": "2B1 Oka / RDS-4",
        "country": "ZSRR/Rosja",
        "yield_kt": 10,
        "year": 1957,
        "category": "Tactical",
        "short_desc": "Absurdalny pocisk z gigantycznego, samobieżnego moździerza o lufie długości 20 metrów. Pojazd trząsł się w posadach i często psuł po każdym strzale."
    },
    {
        "id": "USA_010",
        "name": "SADM (W54)",
        "country": "USA",
        "yield_kt": 0.01,
        "year": 1961,
        "category": "Tactical",
        "short_desc": "Niewielka głowica 'plecakowa'. Komandosi z jednostek specjalnych mieli z nią skakać na spadochronach i ręcznie detonować za liniami wroga."
    }
];

window.archiveDb = {
    intro: "Wybierz akta incydentu, aby przeanalizować przebieg wydarzeń, ocenić ryzyko i w niektórych przypadkach podjąć decyzje, przed którymi stali dowódcy.",
    incidents: [
        {
            id: 'kuba',
            title: 'Kryzys Kubański',
            year: '1962',
            tags: ['Eskalacja', 'Dyplomacja', 'Blokada'],
            desc: 'Absolutny klasyk zimnej wojny. Najbliżej, jak ludzkość kiedykolwiek znalazła się otwartej wojny nuklearnej.',
            type: 'timeline'
        },
        {
            id: 'pietrow',
            title: 'Incydent Pietrowa',
            year: '1983',
            tags: ['Błąd Systemu', 'Mgła Wojny', 'Czas'],
            desc: 'System wczesnego ostrzegania ZSRR zgłasza atak rakietowy. Jeden człowiek musi zdecydować o losach świata w kilka minut.',
            type: 'simulation'
        },
        {
            id: 'ablearcher',
            title: 'Able Archer 83',
            year: '1983',
            tags: ['Nieporozumienie', 'NATO', 'ZSRR'],
            desc: 'Ćwiczenia NATO są tak realistyczne, że radziecki wywiad uznaje je za przygotowania do faktycznego pierwszego uderzenia.',
            type: 'analysis'
        },
        {
            id: 'hiroshima',
            title: 'Hiroszima i Nagasaki',
            year: '1945',
            tags: ['Użycie Bojowe', 'Skutki', 'Dane'],
            desc: 'Jedyne w historii bojowe użycie broni nuklearnej. Analiza skali i zniszczeń.',
            type: 'data'
        },
        {
            id: 'jomkipur',
            title: 'Opcja Samsona (Jom Kipur)',
            year: '1973',
            tags: ['Bliski Wschód', 'Ostatnia Deska Ratunku'],
            desc: 'Izrael na krawędzi porażki konwencjonalnej przygotowuje rakiety Jerycho z głowicami jądrowymi.',
            type: 'scenario'
        },
        {
            id: 'norwegia',
            title: 'Incydent Norweski',
            year: '1995',
            tags: ['Rakieta Badawcza', 'Walizka Nuklearna'],
            desc: 'Wystrzelenie norweskiej rakiety badawczej wyzwala alarm w Rosji. Prezydent Jelcyn otwiera "nuklearną walizkę".',
            type: 'analysis'
        }
    ],
    details: {
        kuba: {
            timeline: [
                { day: 1, date: "14 Paź", text: "Amerykański samolot zwiadowczy U-2 wykonuje zdjęcia radzieckich wyrzutni rakiet SS-4 na Kubie.", tension: 30 },
                { day: 3, date: "16 Paź", text: "Prezydent Kennedy jest informowany o rakietach. Powstaje komitet EXCOMM w celu opracowania opcji.", tension: 40 },
                { day: 7, date: "20 Paź", text: "Kennedy decyduje się na morską 'kwarantannę' Kuby, odrzucając na razie bezpośrednie uderzenie powietrzne.", tension: 55 },
                { day: 9, date: "22 Paź", text: "Orędzie do narodu. Kennedy publicznie ogłasza obecność rakiet i blokadę. Świat wstrzymuje oddech.", tension: 75 },
                { day: 11, date: "24 Paź", text: "Radzieckie statki zbliżają się do linii blokady... i zatrzymują się lub zawracają. 'Patrzyliśmy sobie w oczy, a on właśnie mrugnął'.", tension: 85 },
                { day: 14, date: "27 Paź", text: "CZARNA SOBOTA. U-2 zestrzelony nad Kubą (pilot ginie). Nad Czukotką inny U-2 gubi drogę. Radziecki okręt podwodny B-59 o włos od odpalenia torpedy nuklearnej po obrzuceniu bombami głębinowymi.", tension: 100 },
                { day: 15, date: "28 Paź", text: "Przełom. Chruszczow ogłasza demontaż rakiet w zamian za publiczną gwarancję nieagresji na Kubę i tajne wycofanie rakiet USA z Turcji.", tension: 20 }
            ]
        },
        pietrow: {
            logs: [
                "START SYSTEMU OKO... Zakończono.",
                "NASŁUCH SATELITARNY... W normie.",
                "26 WRZEŚNIA 1983, 00:15 MSK",
                "---------------------------",
                "ALARM! WYKRYTO START POCISKU.",
                "PRAWDOPODOBIEŃSTWO: WYSOKIE.",
                "ŹRÓDŁO: BAZA MALMSTROM, USA.",
                "TYP: LGM-30 MINUTEMAN."
            ]
        },
        hiroshima: {
            yieldData: {
                labels: ["Little Boy (Hiroszima)", "Fat Man (Nagasaki)", "B-61 (Współczesna USA)", "Minuteman III (USA)", "Tsar Bomba (ZSRR, test)"],
                datasets: [{
                    label: 'Moc (w kilotonach TNT)',
                    data: [15, 21, 340, 475, 50000],
                    backgroundColor: ['#ff2a2a', '#e60000', '#cc0000', '#b30000', '#990000']
                }]
            }
        },
        ablearcher: {
            text: "W listopadzie 1983 r. napięcia między USA a ZSRR były niezwykle wysokie. NATO rozpoczęło coroczne ćwiczenia dowodzenia 'Able Archer 83'. Tym razem jednak procedury były wyjątkowo realistyczne: użyto nowych kodów, zarządzono ciszę radiową i symulowano przejście przez wszystkie stopnie gotowości DEFCON aż do ataku nuklearnego.\n\nKGB, w ramach operacji RJaN (Rakietowo-Jądrowe Napadnie), błędnie zinterpretowało te ćwiczenia jako zasłonę dymną dla faktycznego uderzenia wyprzedzającego. Radzieckie jednostki lotnicze w NRD i Polsce załadowały broń jądrową, a 70 rakiet SS-20 zostało postawionych w stan pełnej gotowości. Kryzys minął tylko dlatego, że ćwiczenia NATO zakończyły się zgodnie z planem, zanim ZSRR podjął 'działania wyprzedzające'.",
            tensionData: [10, 20, 30, 50, 80, 95, 90, 40, 10]
        },
        jomkipur: {
            text: "Październik 1973. Po zaskakującym ataku połączonych sił Egiptu i Syrii w dniu święta Jom Kipur, linie obronne Izraela pękają. Na Wzgórzach Golan syryjskie czołgi przełamują front. Minister obrony Mosze Dajan obawia się 'upadku Trzeciej Świątyni'.\n\nW akcie desperacji premier Golda Meir autoryzuje przygotowanie arsenału nuklearnego (oficjalnie nigdy nie potwierdzonego). Rakiety Jerycho I oraz myśliwce F-4 Phantom zostają uzbrojone w głowice jądrowe. Cel: wymuszenie na USA natychmiastowych dostaw broni konwencjonalnej (co nastąpiło w ramach operacji Nickel Grass) oraz ostrzeżenie państw arabskich i ZSRR. Użycie tej broni oznaczałoby odpalenie tzw. 'Opcji Samsona' – zniszczenia wrogów kosztem własnej zagłady."
        },
        norwegia: {
            text: "Zimna wojna oficjalnie się skończyła, ale procedury pozostały. 25 stycznia 1995 r. z Norwegii wystrzelono rakietę badawczą Black Brant XII do badania zorzy polarnej. Chociaż Norwegowie powiadomili dyplomatycznie 30 krajów, informacja ta nie dotarła do rosyjskich radarzystów.\n\nTrajektoria i prędkość rakiety przypominały pocisk Trident wystrzelony z okrętu podwodnego z zamiarem wygenerowania impulsu EMP oślepiającego rosyjskie radary. Po raz pierwszy i jedyny w historii, prezydent Rosji (Borys Jelcyn) aktywował swoją walizkę nuklearną ('Czeget'). Jelcyn miał kilka minut na decyzję o uderzeniu odwetowym. Na szczęście rakieta spadła w okolicach Spitsbergenu, oddalając się od terytorium Rosji, zanim upłynął limit czasu."
        }
    }
};
