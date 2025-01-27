// Load the game data
let storyData;
let currentNode = "start";

// Initialize game systems
async function initializeGame(character = 'nettie') {
    try {
        // Initialize core game state
        Game.state = {
            currentNode: "arrival",
            currentLocation: "everbloom_fields",
            currentCharacter: character,
            inventory: [],
            questLog: [],
            relationships: {},
            emotions: {}
        };

        // Load location data
        const locationResponse = await fetch('assets/locations/mystara/everbloom_fields.json');
        const locationData = await locationResponse.json();
        Game.systems.locations = locationData;

        // Load character data
        const characterResponse = await fetch(`assets/characters/${character}.json`);
        const characterData = await characterResponse.json();
        Game.systems.characters = characterData;

        // Initialize dialogue system
        Game.systems.dialogue = new DialogueManager();
        
        // Start with character's arrival scene
        await Game.systems.dialogue.presentDialogue(character, 'arrival');
        
        // Start Wisp animation
        setInterval(animateWisp, 6000);
        
    } catch (error) {
        console.error('Error initializing game:', error);
        document.getElementById('story').innerHTML = 
            '<p>Error loading game data. Please try again.</p>';
    }
}

// Add Wisp animation
function animateWisp() {
    const wisp = document.querySelector('.wisp');
    const container = document.getElementById('game-container');
    let x = Math.random() * (container.offsetWidth - 50);
    let y = Math.random() * (container.offsetHeight - 50);
    
    wisp.style.left = `${x}px`;
    wisp.style.top = `${y}px`;
}

// Remove the automatic game start
// document.addEventListener('DOMContentLoaded', initializeGame); 

function handleImageLoad() {
    const portraits = document.querySelectorAll('.character-portrait');
    portraits.forEach(portrait => {
        const img = portrait.querySelector('img');
        if (img) {
            portrait.classList.add('loading');
            img.onload = () => {
                portrait.classList.remove('loading');
            };
            img.onerror = () => {
                portrait.classList.remove('loading');
                portrait.classList.add('error');
                console.error(`Failed to load image: ${img.src}`);
            };
        }
    });
}

// Call this when initializing the character selection screen
document.addEventListener('DOMContentLoaded', handleImageLoad); 