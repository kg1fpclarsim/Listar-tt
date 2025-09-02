document.addEventListener('DOMContentLoaded', () => {
    // ####################################################################
    // ### DITT JOBB: FYLL I ALLA KOORDINATER I DENNA SEKTION           ###
    // ####################################################################
    //
    // Hitta koordinater (top, left, width, height) i pixlar för varje
    // knapp på dina tre bilder:
    // 1. handdator.png (huvudmenyn)
    // 2. handdator-hamta.png (undermenyn för "Hämta")
    // 3. handdator-flansa.png (undermenyn för "Flänsa")
    //
    const topLevelMenu = {
        image: 'handdator.png',
        events: [
            { name: "Lasta ut", coords: { top:  197, left: 71, width: 138, height: 76 } },
            { name: "Lossa in", coords: { top: 197, left: 221, width: 138, height: 76 } },
            { 
                name: "Hämta", 
                coords: { top: 287, left: 71, width: 138, height: 76 },
                submenu: {
                    image: 'handdator-hamta.png',
                    backButtonCoords: { top: 145, left: 70, with: 20, height: 25 },
                    events: [
                        { name: "Hämta åt annan bil", coords: { top: 295, left: 70, width: 185, height: 30 } },
                        { name: "Hämta obokad hämtning", coords: { top: 240, left: 70, width: 185, height: 30 } }
                    ]
                }
            },
            { name: "Leverera", coords: { top: 287, left: 221, width: 138, height: 76 } },
            { name: "Bomhämtning", coords: { top: 374, left: 71, width: 138, height: 76 } },
            { name: "Ej levererat", coords: { top: 374, left: 221, width: 138, height: 76 } },
            { name: "Hämtning utan sändnings-ID", coords: { top: 463, left: 71, width: 138, height: 76 } },
            { name: "Åter terminal", coords: { top: 463, left: 221, width: 138, height: 76 } },
            { 
                name: "Flänsa", 
                coords: { top: 552, left: 71, width: 138, height: 76 },
                submenu: {
                    image: 'handdator-flansa.png',
                    backButtonCoords: { top: 145, left: 70, with: 20, height: 25 },
                    events: [
                        { name: "Flänsa på", coords: { top: 197, left: 71, width: 138, height: 76 } },
                        { name: "Flänsa av", coords: { top: 197, left: 221, width: 138, height: 76 } }
                    ]
                }
            }
        ]
    };
    // ####################################################################
    // ### SLUT PÅ SEKTIONEN DU BEHÖVER REDIGERA                        ###
    // ####################################################################

    let scenarioSequence = [];
    let currentStep = 0;
    let currentMenuView = topLevelMenu;
    let menuHistory = [];

    const gameImage = document.getElementById('game-image');
    const imageContainer = document.getElementById('image-container');
    const navOverlay = document.getElementById('navigation-overlay');
    const scenarioTitle = document.getElementById('scenario-title');
    const scenarioDescription.innerHTML = marked.parse(randomScenario.description);
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackArea = document.getElementById('feedback-area');
    const resetButton = document.getElementById('reset-button');

    async function loadRandomScenario() {
        try {
            const response = await fetch('scenarios.json?cachebust=' + new Date().getTime());
            if (!response.ok) throw new Error('Nätverksfel');
            const allScenarios = await response.json();

            if (!allScenarios || allScenarios.length === 0) {
                scenarioTitle.textContent = "Inga Scenarier Hittades";
                scenarioDescription.textContent = "Filen scenarios.json är tom. Öppna admin.html för att skapa ditt första scenario.";
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
            scenarioDescription.textContent = "Kunde inte ladda övningarna. Se till att filen scenarios.json finns och är korrekt formaterad.";
        }
    }
    
    function resetGameState() {
        currentStep = 0;
        menuHistory = [];
        feedbackMessage.textContent = 'Väntar på din första åtgärd...';
        feedbackArea.className = 'feedback-neutral';
        imageContainer.style.display = 'block';
        switchMenuView(topLevelMenu);
    }

  function switchMenuView(menuData) {
    currentMenuView = menuData;
    gameImage.src = menuData.image;
    createClickableAreas(menuData.events);

    navOverlay.innerHTML = ''; // Rensa eventuella gamla knappar/ytor
    
    // Om den nuvarande menyn har koordinater för en tillbaka-knapp
    if (menuData.backButtonCoords) {
        const backArea = document.createElement('div');
        backArea.classList.add('clickable-area'); // Återanvänd samma stil
        backArea.style.top = `${menuData.backButtonCoords.top}px`;
        backArea.style.left = `${menuData.backButtonCoords.left}px`;
        backArea.style.width = `${menuData.backButtonCoords.width}px`;
        backArea.style.height = `${menuData.backButtonCoords.height}px`;

        backArea.addEventListener('click', () => {
            if (menuHistory.length > 0) {
                const previousMenu = menuHistory.pop();
                switchMenuView(previousMenu);
            }
        });
        navOverlay.appendChild(backArea);
    }
}
    
    function createClickableAreas(eventsToCreate) {
        imageContainer.querySelectorAll('.clickable-area').forEach(area => area.remove());
        if (!eventsToCreate) return;
        
        eventsToCreate.forEach(event => {
            const area = document.createElement('div');
            area.classList.add('clickable-area');
            area.style.top = `${event.coords.top}px`;
            area.style.left = `${event.coords.left}px`;
            area.style.width = `${event.coords.width}px`;
            area.style.height = `${event.coords.height}px`;
            area.addEventListener('click', () => handleEventClick(event, area));
            imageContainer.appendChild(area);
        });
    }

    function handleEventClick(clickedEvent, areaElement) {
    if (!scenarioSequence || scenarioSequence.length === 0) return;
    
    const isFinished = currentStep >= scenarioSequence.length;
    if(isFinished) return;

    if (clickedEvent.name === scenarioSequence[currentStep]) {
        feedbackMessage.textContent = `Korrekt! "${clickedEvent.name}" var rätt steg.`;
        feedbackArea.className = 'feedback-correct';
        areaElement.classList.add('area-correct-feedback');
        areaElement.style.pointerEvents = 'none';
        currentStep++;

        // NYTT TILLÄGG: Gå tillbaka till huvudmenyn automatiskt
        // Om vi är i en undermeny (historik finns) och valet inte har en egen undermeny.
        if (menuHistory.length > 0 && !clickedEvent.submenu) {
            // Vänta en kort stund så användaren ser feedback, sedan gå tillbaka.
            setTimeout(() => {
                menuHistory = []; // Rensa historiken
                switchMenuView(topLevelMenu);
            }, 700); // 0.7 sekunders fördröjning
            return; // Avsluta här för att inte processa nästa if-sats
        }
        
        // Kolla om spelet är slutfört
        if (currentStep === scenarioSequence.length) {
            feedbackMessage.textContent = 'Bra gjort! Hela sekvensen är korrekt.';
            feedbackArea.className = 'feedback-correct';
        }
        
        // Byt till undermeny om det finns en
        if (clickedEvent.submenu) {
            menuHistory.push(currentMenuView);
            switchMenuView(clickedEvent.submenu);
        }
    } else {
        feedbackMessage.textContent = `Fel ordning. Försök igen.`;
        feedbackArea.className = 'feedback-incorrect';
        areaElement.classList.add('area-incorrect-feedback');
        setTimeout(() => { areaElement.classList.remove('area-incorrect-feedback'); }, 500);
    }
}

    resetButton.addEventListener('click', loadRandomScenario);
    loadRandomScenario(); 
});
