document.addEventListener('DOMContentLoaded', () => {
    // ... (behåll `ALL_EVENTS`-listan som förut) ...
    const ALL_EVENTS = [ /* ... din lista med alla 9 händelser ... */ ];

    let currentSequence = [];
    let scenarios = []; // Starta med en tom lista, vi laddar från fil

    // Uppdatera HTML-elementen för att inkludera den nya export-rutan
    document.querySelector('.card:nth-of-type(1)').innerHTML += `
        <div class="export-container">
            <h3>Exportera för GitHub</h3>
            <p>När du är klar, klicka på "Generera JSON". Kopiera texten från rutan och klistra in den i 
            <code>scenarios.json</code>-filen i ditt GitHub-projekt.</p>
            <button id="export-btn" class="btn btn-primary">Generera JSON</button>
            <textarea id="json-output" readonly></textarea>
        </div>
    `;

    const descriptionInput = document.getElementById('scenario-description');
    const availableButtonsContainer = document.getElementById('available-buttons');
    const selectedSequenceContainer = document.getElementById('selected-sequence');
    const saveButton = document.getElementById('save-scenario-btn');
    const clearButton = document.getElementById('clear-sequence-btn');
    const scenariosList = document.getElementById('scenarios-list');
    const exportButton = document.getElementById('export-btn');
    const jsonOutput = document.getElementById('json-output');

    // Ladda befintliga scenarier från filen när sidan startar
    async function loadExistingScenarios() {
        try {
            const response = await fetch('scenarios.json');
            if (response.ok) {
                scenarios = await response.json();
                renderScenariosList();
            }
        } catch (error) {
            console.warn("Kunde inte ladda befintlig scenarios.json, startar med en tom lista.", error);
        }
    }
    
    // ... (Behåll `renderAvailableButtons`, `renderSelectedSequence` som förut) ...
    function renderAvailableButtons() { /* ... din kod här ... */ }
    function renderSelectedSequence() { /* ... din kod här ... */ }

    // Uppdatera renderScenariosList för att fungera med den nya datan
    function renderScenariosList() {
        // ... (denna funktion kan behållas nästan exakt som den var, men den anropar inte localStorage) ...
    }

    // Event listener för Spara-knappen (sparar bara i minnet, inte localStorage)
    saveButton.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        if (description === '' || currentSequence.length === 0) {
            alert('Du måste ange en beskrivning och välja minst ett steg.');
            return;
        }
        scenarios.push({ description: description, sequence: currentSequence });
        descriptionInput.value = '';
        currentSequence = [];
        renderSelectedSequence();
        renderScenariosList();
        jsonOutput.value = ''; // Rensa exportrutan eftersom datan är inaktuell
    });

    // Event listener för Export-knappen
    exportButton.addEventListener('click', () => {
        // JSON.stringify med 'null, 2' gör texten vackert formatterad och lättläst
        const jsonString = JSON.stringify(scenarios, null, 2);
        jsonOutput.value = jsonString;
        jsonOutput.select(); // Markera all text så den är lätt att kopiera
        alert('JSON genererad! Kopiera texten från rutan nedan.');
    });

    // ... (Behåll övriga event listeners och initieringsanrop) ...
    // Se till att din `renderScenariosList` också uppdateras för att inte använda localStorage
    // Och glöm inte att anropa loadExistingScenarios() vid start.

    loadExistingScenarios();
    renderAvailableButtons();
    renderSelectedSequence();
});
