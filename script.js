document.addEventListener('DOMContentLoaded', () => {
    // STEG 1: Fyll i koordinaterna för ALLA knappar på din bild.
    // Denna lista måste vara exakt samma som i admin.js.
    const eventData = [
        { name: "Lasta ut", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Lossa in", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Hämta", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Leverera", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Bomhämtning", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Ej levererat", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Hämtning utan sändnings-ID", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Åter terminal", coords: { top: 0, left: 0, width: 0, height: 0 } },
        { name: "Flänsa", coords: { top: 0, left: 0, width: 0, height: 0 } }
    ];

    // Variabler som kommer att fyllas av det slumpade scenariot
    let scenarioSequence = [];
    let currentStep = 0;

    // --- HTML-element ---
    const scenarioTitle = document.getElementById('scenario-title');
    const scenarioDescription = document.getElementById('scenario-description');
    const imageContainer = document.getElementById('image-container');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackArea = document.getElementById('feedback-area');
    const resetButton = document.getElementById('reset-button');

    // --- Funktioner ---
    
    // NY FUNKTION: Laddar och förbereder ett slumpmässigt scenario
    function loadRandomScenario() {
        const allScenarios = JSON.parse(localStorage.getItem('drivingScenarios')) || [];

        if (allScenarios.length === 0) {
            scenarioTitle.textContent = "Inga Scenarier Hittades";
            scenarioDescription.textContent = "Öppna admin.html för att skapa ditt första scenario.";
            imageContainer.style.display = 'none'; // Göm spelet om inga scenarier finns
            return;
        }
        
        // Välj ett scenario slumpmässigt
        const randomScenario = allScenarios[Math.floor(Math.random() * allScenarios.length)];
        
        // Sätt spelets variabler
        scenarioSequence = randomScenario.sequence;
        scenarioTitle.textContent = "Övning";
        scenarioDescription.textContent = randomScenario.description;

        // Återställ spelets tillstånd
        currentStep = 0;
        feedbackMessage.textContent = 'Väntar på din första åtgärd...';
        feedbackArea.className = 'feedback-neutral';
        createClickableAreas();
    }

    // Skapar de klickbara ytorna (samma som förut)
    function createClickableAreas() {
        imageContainer.querySelectorAll('.clickable-area').forEach(area => area.remove());
        eventData.forEach(event => {
            const area = document.createElement('div');
            area.classList.add('clickable-area');
            area.style.top = `${event.coords.top}px`;
            area.style.left = `${event.coords.left}px`;
            area.style.width = `${event.coords.width}px`;
            area.style.height = `${event.coords.height}px`;
            area.dataset.eventName = event.name;
            area.addEventListener('click', () => handleEventClick(event.name, area));
            imageContainer.appendChild(area);
        });
    }

    // Hanterar klick (samma som förut)
    function handleEventClick(clickedEventName, areaElement) {
        if (!scenarioSequence || scenarioSequence.length === 0) return; // Gör inget om inget scenario är laddat

        if (clickedEventName === scenarioSequence[currentStep]) {
            feedbackMessage.textContent = `Korrekt! "${clickedEventName}" var rätt steg.`;
            feedbackArea.className = 'feedback-correct';
            areaElement.classList.add('area-correct-feedback');
            areaElement.style.pointerEvents = 'none';
            currentStep++;
            if (currentStep === scenarioSequence.length) {
                feedbackMessage.textContent = 'Bra gjort! Hela sekvensen är korrekt.';
                feedbackArea.className = 'feedback-correct';
            }
        } else {
            feedbackMessage.textContent = `Fel ordning. Försök igen.`;
            feedbackArea.className = 'feedback-incorrect';
            areaElement.classList.add('area-incorrect-feedback');
            setTimeout(() => { areaElement.classList.remove('area-incorrect-feedback'); }, 500);
        }
    }

    // --- Initiering ---
    resetButton.addEventListener('click', loadRandomScenario);
    loadRandomScenario(); // Ladda ett scenario direkt när sidan startar
});
