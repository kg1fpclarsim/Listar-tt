document.addEventListener('DOMContentLoaded', () => {
    // ... (behåll din `eventData`-lista med koordinater precis som förut) ...
    const eventData = [ 
        /* ... din lista med knappar och koordinater ... */ 
    ];

    let scenarioSequence = [];
    let currentStep = 0;

    const scenarioTitle = document.getElementById('scenario-title');
    const scenarioDescription = document.getElementById('scenario-description');
    const imageContainer = document.getElementById('image-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackArea = document.getElementById('feedback-area');
    const resetButton = document.getElementById('reset-button');

    // NY FUNKTION: Laddar scenarier från en JSON-fil
    async function loadRandomScenario() {
        try {
            // Hämta scenarierna från din JSON-fil
            const response = await fetch('scenarios.json');
            if (!response.ok) {
                throw new Error('Kunde inte ladda scenarios.json. Se till att filen finns.');
            }
            const allScenarios = await response.json();

            if (!allScenarios || allScenarios.length === 0) {
                scenarioTitle.textContent = "Inga Scenarier Hittades";
                scenarioDescription.textContent = "Databasen (scenarios.json) är tom eller kunde inte läsas.";
                imageContainer.style.display = 'none';
                return;
            }
            
            const randomScenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];
            
            scenarioSequence = randomScenario.sequence;
            scenarioTitle.textContent = "Övning";
            scenarioDescription.textContent = randomScenario.description;
            
            resetGameState();

        } catch (error) {
            console.error("Fel vid laddning av scenario:", error);
            scenarioTitle.textContent = "Ett fel uppstod";
            scenarioDescription.textContent = "Kunde inte ladda övningarna. Kontrollera webbläsarens konsol för felmeddelanden.";
        }
    }
    
    // Hjälpfunktion för att återställa spelet utan att ladda om data
    function resetGameState() {
        currentStep = 0;
        feedbackMessage.textContent = 'Väntar på din första åtgärd...';
        feedbackArea.className = 'feedback-neutral';
        // Se till att bildbehållaren är synlig om den var dold
        imageContainer.style.display = 'block';
        createClickableAreas();
    }

    // ... (Behåll `createClickableAreas` och `handleEventClick` exakt som de var) ...

    function createClickableAreas() { /* ... din kod här ... */ }
    function handleEventClick(clickedEventName, areaElement) { /* ... din kod här ... */ }

    // --- Initiering ---
    resetButton.addEventListener('click', loadRandomScenario);
    loadRandomScenario(); 
});
