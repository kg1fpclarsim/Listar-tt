document.addEventListener('DOMContentLoaded', () => {
    // --- Inställningar ---
    // Här definierar du händelserna och deras korrekta ordning.
    // Du kan enkelt ändra, lägga till eller ta bort händelser här.
    const correctOrder = [
        "Ankom till kund",
        "Skanna godset",
        "Ta emot signatur",
        "Leverans slutförd"
    ];

    // --- Variabler ---
    let currentStep = 0; // Håller reda på vilket steg spelaren är på (börjar på 0)
    let events = [...correctOrder].sort(() => Math.random() - 0.5); // Blanda ordningen på knapparna

    // --- HTML-element ---
    const eventButtonsContainer = document.getElementById('event-buttons');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackArea = document.getElementById('feedback-area');
    const resetButton = document.getElementById('reset-button');

    // --- Funktioner ---

    // Skapar knapparna baserat på 'events'-listan
    function createButtons() {
        eventButtonsContainer.innerHTML = ''; // Rensa eventuella gamla knappar
        events.forEach(eventText => {
            const button = document.createElement('button');
            button.textContent = eventText;
            button.classList.add('event-btn');
            button.addEventListener('click', () => handleEventClick(eventText, button));
            eventButtonsContainer.appendChild(button);
        });
    }

    // Hanterar vad som händer när en knapp klickas
    function handleEventClick(clickedEvent, buttonElement) {
        // Kontrollera om den klickade händelsen är den korrekta för det nuvarande steget
        if (clickedEvent === correctOrder[currentStep]) {
            // Rätt svar
            feedbackMessage.textContent = `Korrekt! "${clickedEvent}" var rätt steg.`;
            feedbackArea.className = 'feedback-correct';
            buttonElement.classList.add('disabled'); // Inaktivera knappen
            buttonElement.disabled = true;
            
            currentStep++; // Gå vidare till nästa steg

            // Kolla om spelet är slutfört
            if (currentStep === correctOrder.length) {
                feedbackMessage.textContent = 'Bra gjort! Hela sekvensen är korrekt. Du kan nu börja om.';
                feedbackArea.className = 'feedback-correct';
            }
        } else {
            // Fel svar
            feedbackMessage.textContent = `Fel ordning. Försök igen. Vad är det korrekta steget efter "${currentStep > 0 ? correctOrder[currentStep - 1] : 'start'}"?`;
            feedbackArea.className = 'feedback-incorrect';
        }
    }
    
    // Återställer spelet till startläget
    function resetGame() {
        currentStep = 0;
        events = [...correctOrder].sort(() => Math.random() - 0.5); // Blanda knapparna på nytt
        feedbackMessage.textContent = 'Väntar på din första åtgärd...';
        feedbackArea.className = 'feedback-neutral';
        createButtons();
    }

    // --- Initiering ---
    resetButton.addEventListener('click', resetGame);
    createButtons(); // Skapa knapparna när sidan laddas
});
