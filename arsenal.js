// arsenal.js - Moduł Bazy Danych Arsenału

let arsenalCharts = {
    timeline: null,
    country: null
};

let currentFilters = {
    category: 'all',
    country: 'all'
};

function initArsenal() {
    populateArsenalCountryDropdown();
    setupArsenalEventListeners();
    initArsenalCharts();
    updateArsenalApp();
}

function populateArsenalCountryDropdown() {
    const filterCountry = document.getElementById('filter-country');
    if (!filterCountry) return;
    
    const countries = [...new Set(window.nuclearData.map(item => item.country))].sort();
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        filterCountry.appendChild(option);
    });
}

function setupArsenalEventListeners() {
    const cat = document.getElementById('filter-category');
    const cnt = document.getElementById('filter-country');
    if(cat) {
        cat.addEventListener('change', (e) => {
            currentFilters.category = e.target.value;
            updateArsenalApp();
        });
    }
    if(cnt) {
        cnt.addEventListener('change', (e) => {
            currentFilters.country = e.target.value;
            updateArsenalApp();
        });
    }
}

function getFilteredData() {
    return window.nuclearData.filter(item => {
        const matchCategory = currentFilters.category === 'all' || item.category === currentFilters.category;
        const matchCountry = currentFilters.country === 'all' || item.country === currentFilters.country;
        return matchCategory && matchCountry;
    });
}

function updateArsenalStats(filteredData) {
    const count = filteredData.length;
    const totalYield = filteredData.reduce((sum, item) => sum + item.yield_kt, 0);
    const countriesCount = new Set(filteredData.map(i => i.country)).size;

    document.getElementById('stat-count').innerText = count;
    document.getElementById('stat-yield').innerText = totalYield.toLocaleString('pl-PL');
    document.getElementById('stat-countries').innerText = countriesCount;
}

function getCategoryLabels(category) {
    switch(category) {
        case 'Tactical': return { label: 'Taktyczne', cssClass: 'cat-Tactical' };
        case 'Strategic': return { label: 'Strategiczne', cssClass: 'cat-Strategic' };
        case 'Milestones': return { label: 'Kamienie Milowe', cssClass: 'cat-Milestones' };
        default: return { label: 'Inne', cssClass: '' };
    }
}

function renderArsenalGrid(filteredData) {
    const grid = document.getElementById('weapons-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    if (filteredData.length === 0) {
        grid.innerHTML = '<div style="color:#888; text-align:center; width:100%; grid-column:1/-1;">BRAK WYNIKÓW</div>';
        return;
    }

    filteredData.sort((a,b) => a.year - b.year).forEach(item => {
        const catMeta = getCategoryLabels(item.category);
        
        const card = document.createElement('div');
        card.className = 'weapon-card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <span class="weapon-cat ${catMeta.cssClass}">${catMeta.label}</span>
                <span style="color:#555; font-size:0.8rem;">${item.year}</span>
            </div>
            <div class="weapon-name">${item.name}</div>
            <div style="font-size:0.7rem; color:#888; margin-bottom:5px;">⚐ ${item.country}</div>
            <div class="weapon-desc">${item.short_desc}</div>
            <div class="weapon-yield glow-text-red">${item.yield_kt.toLocaleString('pl-PL')} kT</div>
        `;
        grid.appendChild(card);
    });
}

function initArsenalCharts() {
    Chart.defaults.font.family = "monospace";
    Chart.defaults.color = '#888';

    const ctxTimeline = document.getElementById('timelineChart');
    if(!ctxTimeline) return;
    
    arsenalCharts.timeline = new Chart(ctxTimeline.getContext('2d'), {
        type: 'scatter',
        data: { datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#ccc' } },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderColor: '#00ff41',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return [
                                point.name,
                                `Kraj: ${point.country}`,
                                `Siła: ${point.y.toLocaleString('pl-PL')} kt`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Rok', color: '#ccc' },
                    ticks: { callback: function(value) { return value.toString().replace(/,/g, ''); }, stepSize: 10, color: '#aaa' },
                    grid: { color: '#222' }
                },
                y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Siła Wybuchu (KT)', color: '#ccc' },
                    grid: { color: '#222' },
                    ticks: {
                        color: '#aaa',
                        callback: function(value) {
                            if(value === 0.01 || value === 1 || value === 10 || value === 100 || value === 1000 || value === 10000 || value === 50000) {
                                return value + ' kt';
                            }
                        }
                    }
                }
            }
        }
    });

    const ctxCountry = document.getElementById('countryChart');
    if(!ctxCountry) return;
    
    arsenalCharts.country = new Chart(ctxCountry.getContext('2d'), {
        type: 'bar',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#aaa' },
                    title: { display: true, text: 'Ilość', color: '#ccc' },
                    grid: { color: '#222' }
                },
                x: {
                    ticks: { color: '#aaa' },
                    grid: { display: false }
                }
            }
        }
    });
}

function updateArsenalCharts(filteredData) {
    if(!arsenalCharts.timeline) return;

    const tacticalData = filteredData.filter(d => d.category === 'Tactical').map(d => ({x: d.year, y: d.yield_kt, name: d.name, country: d.country}));
    const strategicData = filteredData.filter(d => d.category === 'Strategic').map(d => ({x: d.year, y: d.yield_kt, name: d.name, country: d.country}));
    const milestoneData = filteredData.filter(d => d.category === 'Milestones').map(d => ({x: d.year, y: d.yield_kt, name: d.name, country: d.country}));

    arsenalCharts.timeline.data = {
        datasets: [
            {
                label: 'Taktyczne',
                data: tacticalData,
                backgroundColor: 'rgba(250, 204, 21, 0.7)',
                borderColor: '#facc15',
                pointRadius: 6
            },
            {
                label: 'Strategiczne',
                data: strategicData,
                backgroundColor: 'rgba(0, 204, 255, 0.7)',
                borderColor: '#00ccff',
                pointRadius: 7
            },
            {
                label: 'Kamienie Milowe',
                data: milestoneData,
                backgroundColor: 'rgba(0, 255, 65, 0.8)',
                borderColor: '#00ff41',
                pointRadius: 8,
                pointStyle: 'triangle'
            }
        ]
    };
    arsenalCharts.timeline.update();

    const countryCounts = {};
    filteredData.forEach(item => {
        countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
    });
    
    const sortedCountries = Object.keys(countryCounts).sort((a,b) => countryCounts[b] - countryCounts[a]);
    const barData = sortedCountries.map(c => countryCounts[c]);

    arsenalCharts.country.data = {
        labels: sortedCountries,
        datasets: [{
            label: 'Ilość',
            data: barData,
            backgroundColor: 'rgba(255, 42, 42, 0.6)',
            borderColor: '#ff2a2a',
            borderWidth: 1
        }]
    };
    arsenalCharts.country.update();
}

function updateArsenalApp() {
    const data = getFilteredData();
    updateArsenalStats(data);
    renderArsenalGrid(data);
    updateArsenalCharts(data);
}

// Inicjalizacja opóźniona aby nie blokować głównej pętli
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initArsenal, 500);
});
