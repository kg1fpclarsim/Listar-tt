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
            { name: "Lasta ut", coords: { top: 0, left: 0, width: 0, height: 0 } },
            { name: "Lossa in", coords: { top: 0, left: 0, width: 0, height: 0 } },
            { 
                name: "Hämta", 
                coords: { top: 0, left: 0, width: 0, height: 0 },
                submenu: {
                    image: 'handdator-hamta.png',
                    events: [
                        { name: "Hämta åt annan bil", coords: { top: 0, left: 0, width: 0, height: 0 } },
                        { name: "Hämta obokad hämtning", coords: { top: 0, left: 0, width: 0, height: 0 } }
                    ]
                }
            },
            { name: "Leverera", coords: { top: 0, left: 0, width: 0, height: 0 } },
            { name: "Bomhämtning", coords: { top: 0, left: 0, width: 0, height: 0 } },
            { name: "Ej levererat", coords: { top: 0, left: 0, width: 0, height: 0 } },
            { name: "Hämtning utan sändnings-ID", coords: { top: 0, left: 0, width: 0, height: 0 } },
            { name: "Åter terminal", coords: { top: 0, left: 0, width: 0, height: 0 } },
            { 
                name: "Flänsa", 
                coords: { top: 0, left: 0, width: 0, height: 0 },
                submenu: {
                    image: 'handdator-flansa.png',
                    events: [
                        { name: "Flänsa på", coords: { top: 0, left: 0, width: 0, height: 0 } },
                        { name: "Flänsa av", coords: { top: 0, left: 0, width: 0, height: 0 } }
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
    const scenarioDescription = document.getElementById('scenario-description');
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

        navOverlay.innerHTML = '';
        if (menuHistory.length > 0) {
            const backBtn = document.createElement('button');
            backBtn.textContent = '‹ Tillbaka';
            backBtn.className = 'back-btn';
            backBtn.addEventListener('click', () => {
                const previousMenu = menuHistory.pop();
                switchMenuView(previousMenu);
            });
            navOverlay.appendChild(backBtn);
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

            if (currentStep === scenarioSequence.length) {
                feedbackMessage.textContent = 'Bra gjort! Hela sekvensen är korrekt.';
                feedbackArea.className = 'feedback-correct';
            }

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
