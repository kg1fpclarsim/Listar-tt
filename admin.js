document.addEventListener('DOMContentLoaded', () => {
    // Samma lista över alla möjliga händelser som i spelet
    const ALL_EVENTS = [
        "Lasta ut", "Lossa in", "Hämta", "Leverera", "Bomhämtning", 
        "Ej levererat", "Hämtning utan sändnings-ID", "Åter terminal", "Flänsa"
    ];

    let currentSequence = [];
    let scenarios = JSON.parse(localStorage.getItem('drivingScenarios')) || [];

    const descriptionInput = document.getElementById('scenario-description');
    const availableButtonsContainer = document.getElementById('available-buttons');
    const selectedSequenceContainer = document.getElementById('selected-sequence');
    const saveButton = document.getElementById('save-scenario-btn');
    const clearButton = document.getElementById('clear-sequence-btn');
    const scenariosList = document.getElementById('scenarios-list');

    // --- Funktioner ---

    function renderAvailableButtons() {
        availableButtonsContainer.innerHTML = '';
        ALL_EVENTS.forEach(event => {
            const btn = document.createElement('button');
            btn.textContent = event;
            btn.className = 'btn';
            btn.addEventListener('click', () => {
                currentSequence.push(event);
                renderSelectedSequence();
            });
            availableButtonsContainer.appendChild(btn);
        });
    }

    function renderSelectedSequence() {
        selectedSequenceContainer.innerHTML = '';
        if (currentSequence.length === 0) {
            selectedSequenceContainer.innerHTML = '<p><em>Inga steg valda.</em></p>';
            return;
        }
        currentSequence.forEach((step, index) => {
            const stepEl = document.createElement('span');
            stepEl.className = 'sequence-step';
            stepEl.textContent = `${index + 1}. ${step}`;
            selectedSequenceContainer.appendChild(stepEl);
        });
    }

    function renderScenariosList() {
        scenariosList.innerHTML = '';
        if (scenarios.length === 0) {
            scenariosList.innerHTML = '<p>Inga scenarier sparade ännu.</p>';
            return;
        }
        scenarios.forEach((scenario, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${scenario.description}</strong>
                <br>
                <small>${scenario.sequence.join(' → ')}</small>
                <button class="delete-btn" data-index="${index}">Ta bort</button>
            `;
            scenariosList.appendChild(listItem);
        });
        
        // Lägg till event listeners för de nya delete-knapparna
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToDelete = parseInt(e.target.dataset.index, 10);
                scenarios.splice(indexToDelete, 1);
                saveAndRenderAll();
            });
        });
    }

    function saveAndRenderAll() {
        localStorage.setItem('drivingScenarios', JSON.stringify(scenarios));
        renderSelectedSequence();
        renderScenariosList();
    }

    // --- Event Listeners ---
    
    saveButton.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        if (description === '' || currentSequence.length === 0) {
            alert('Du måste ange en beskrivning och välja minst ett steg i sekvensen.');
            return;
        }
        scenarios.push({
            description: description,
            sequence: currentSequence
        });
        descriptionInput.value = '';
        currentSequence = [];
        saveAndRenderAll();
    });

    clearButton.addEventListener('click', () => {
        currentSequence = [];
        renderSelectedSequence();
    });

    // --- Initiering ---
    renderAvailableButtons();
    saveAndRenderAll();
});
