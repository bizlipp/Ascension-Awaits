import { Game } from './game.js';
import { AssetLoader } from './assetLoader.js';

class MenuManager {
    constructor(game) {
        if (!game) {
            throw new Error('MenuManager requires a Game instance');
        }
        
        console.log('MenuManager initializing...');
        this.game = game;
        this.assetLoader = new AssetLoader();
        this.currentScreen = null;
        this.screens = new Map();
        this.buttons = new Map();
        this.selectedCharacter = null;
        this.gameMenuActive = false;
        this.currentCharacter = null;
        this.characters = {};
        
        // Initialize after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            // Initialize screens map
            const screenElements = ['main-menu', 'character-select'];
            
            for (const id of screenElements) {
                const element = document.getElementById(id);
                if (element) {
                    this.screens.set(id, element);
                } else {
                    console.warn(`Screen element not found: ${id}`);
                }
            }

            // Initialize buttons map
            const buttonElements = {
                'new-game': this.handleNewGame.bind(this),
                'continue-game': this.handleContinue.bind(this),
                'settings': this.handleSettings.bind(this),
                'back-to-menu': this.handleBackToMenu.bind(this)
            };

            for (const [id, handler] of Object.entries(buttonElements)) {
                const button = document.getElementById(id);
                if (button) {
                    // Store reference to button and its handler
                    this.buttons.set(id, { element: button, handler });
                    button.addEventListener('click', handler);
                } else {
                    console.warn(`Button element not found: ${id}`);
                }
            }

            await this.assetLoader.preloadAssets();
            console.log('MenuManager initialized successfully');
            
        } catch (error) {
            console.error('Error initializing MenuManager:', error);
        }
    }

    showScreen(screenId) {
        const screen = this.screens.get(screenId);
        if (!screen) {
            console.error(`Screen not found: ${screenId}`);
            return;
        }

        // Hide current screen if exists
        if (this.currentScreen) {
            this.currentScreen.classList.remove('active');
            this.currentScreen.classList.add('hidden');
        }

        // Show new screen
        screen.classList.remove('hidden');
        screen.classList.add('active');
        this.currentScreen = screen;
        
        console.log(`Switched to screen: ${screenId}`);
    }

    // Button Handlers
    handleNewGame() {
        console.log('New Game clicked');
        this.showScreen('character-select');
    }

    handleContinue() {
        console.log('Continue clicked');
        if (localStorage.getItem('gameState')) {
            this.continueGame();
        } else {
            alert('No saved game found!');
        }
    }

    handleSettings() {
        console.log('Settings clicked');
        this.showScreen('settings-screen');
    }

    handleBackToMenu() {
        console.log('Back to menu clicked');
        this.showScreen('main-menu');
    }

    // Cleanup method to remove event listeners
    cleanup() {
        for (const { element, handler } of this.buttons.values()) {
            element.removeEventListener('click', handler);
        }
        this.buttons.clear();
        this.screens.clear();
    }

    hideAllScreens() {
        console.log('Hiding all screens');
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            console.log(`Processing screen: ${screen.id}`);
            screen.classList.remove('active');
            screen.style.display = 'none';
            console.log(`Hidden screen: ${screen.id}`);
        });
    }

    setupMainMenuButtons() {
        console.log('Setting up main menu buttons');
        
        const handlers = {
            newGame: (event) => {
                event.preventDefault();
                console.log('New Game button clicked');
                
                // Get screens
                const mainMenu = document.getElementById('main-menu');
                const characterSelect = document.getElementById('character-select');
                
                if (!characterSelect) {
                    console.error('Character select screen not found!');
                    return;
                }

                // Hide main menu
                if (mainMenu) {
                    mainMenu.classList.remove('active');
                    mainMenu.style.display = 'none';
                }

                // Show character select
                characterSelect.style.display = 'flex';
                requestAnimationFrame(() => {
                    characterSelect.classList.add('active');
                    this.currentScreen = 'character-select';
                    this.setupCharacterSelectButtons();
                });
            },
            continue: () => {
                console.log('Continue clicked');
                if (localStorage.getItem('gameState')) {
                    this.continueGame();
                } else {
                    alert('No saved game found!');
                }
            },
            settings: () => {
                console.log('Settings clicked');
                this.showScreen('settings-screen');
            },
            credits: () => {
                console.log('Credits clicked');
                this.showScreen('credits-screen');
            }
        };

        // Setup button listeners
        const buttons = {
            'new-game': handlers.newGame,
            'continue-game': handlers.continue,
            'settings': handlers.settings,
            'credits': handlers.credits
        };

        Object.entries(buttons).forEach(([id, handler]) => {
            const button = document.getElementById(id);
            if (button) {
                // Remove any existing listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                newButton.addEventListener('click', (event) => handler.call(this, event));
                console.log(`Handler attached to ${id} button`);
            } else {
                console.error(`Button not found: ${id}`);
            }
        });
    }

    setupOtherButtons() {
        console.log('Initializing other buttons...');
        this.setupSettingsButtons();
        this.setupQuickAccessButtons();
    }

    setupSettingsButtons() {
        // Settings screen buttons
        document.getElementById('settings-back')?.addEventListener('click', () => {
            console.log('Settings back clicked');
            this.showScreen('main-menu');
        });

        document.getElementById('save-settings')?.addEventListener('click', () => {
            console.log('Save settings clicked');
            this.saveSettings();
        });

        // Credits screen back button
        document.getElementById('credits-back')?.addEventListener('click', () => {
            console.log('Credits back clicked');
            this.showScreen('main-menu');
        });
    }

    setupCharacterSelectButtons() {
        console.log('Setting up character select buttons');
        
        // Back button
        const backBtn = document.getElementById('back-to-menu');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                console.log('Back to menu clicked');
                
                // Hide character select
                const characterSelect = document.getElementById('character-select');
                if (characterSelect) {
                    characterSelect.classList.remove('active');
                    characterSelect.style.display = 'none';
                }

                // Show main menu
                const mainMenu = document.getElementById('main-menu');
                if (mainMenu) {
                    mainMenu.style.display = 'flex';
                    mainMenu.classList.add('active');
                    this.currentScreen = 'main-menu';
                }
            });
        }

        // Character cards
        const characterCards = document.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selection from all cards
                characterCards.forEach(c => c.classList.remove('selected'));
                
                // Add selection to clicked card
                card.classList.add('selected');
                this.selectedCharacter = card.dataset.character;

                // Enable start button
                const startBtn = document.getElementById('start-journey');
                if (startBtn) {
                    startBtn.removeAttribute('disabled');
                    startBtn.classList.add('active');
                }
            });
        });

        // Start journey button
        const startBtn = document.getElementById('start-journey');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.selectedCharacter) {
                    this.startGame();
                } else {
                    alert('Please select a character first');
                }
            });
        }
    }

    async initializeAssets() {
        try {
            await this.assetLoader.preloadAssets();
            console.log('Assets preloaded:', this.assetLoader.getCacheStats());
        } catch (error) {
            console.error('Error preloading assets:', error);
        }
    }

    initializeListeners() {
        // Main Menu
        document.getElementById('new-game').addEventListener('click', () => this.showScreen('character-select'));
        document.getElementById('continue-game').addEventListener('click', () => this.continueGame());
        document.getElementById('settings').addEventListener('click', () => this.showScreen('settings-screen'));
        document.getElementById('credits').addEventListener('click', () => this.showScreen('credits-screen'));

        // Settings Screen
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        document.getElementById('settings-back').addEventListener('click', () => this.showScreen('main-menu'));

        // Credits Screen
        document.getElementById('credits-back').addEventListener('click', () => this.showScreen('main-menu'));

        // Game Menu
        document.querySelector('.menu-button').addEventListener('click', () => this.toggleGameMenu());
        document.getElementById('resume').addEventListener('click', () => this.toggleGameMenu());
        document.getElementById('save').addEventListener('click', () => this.saveGame());
        document.getElementById('load').addEventListener('click', () => this.loadGame());
        document.getElementById('game-settings').addEventListener('click', () => this.showScreen('settings-screen'));
        document.getElementById('quit-to-menu').addEventListener('click', () => this.quitToMenu());

        // Update inventory and abilities button listeners
        document.getElementById('inventory-btn').addEventListener('click', () => {
            this.showInventory(this.currentCharacter);
        });

        document.getElementById('abilities-btn').addEventListener('click', () => {
            this.showAbilities(this.currentCharacter);
        });

        // Close buttons for inventory and abilities screens
        document.querySelectorAll('.close-button').forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.screen').classList.remove('active');
            });
        });

        // Close screens when clicking outside
        document.querySelectorAll('.inventory-screen, .abilities-screen').forEach(screen => {
            screen.addEventListener('click', (e) => {
                if (e.target === screen) {
                    screen.classList.remove('active');
                }
            });
        });
    }

    initializeRatingSystem() {
        const ratingSelect = document.getElementById('content-rating');
        const descriptions = document.querySelectorAll('.rating-description p');

        // Show initial description
        this.updateRatingDescription(ratingSelect.value);

        // Add change listener
        ratingSelect.addEventListener('change', (e) => {
            const rating = e.target.value;
            this.updateRatingDescription(rating);
            
            // Show confirmation for NC17
            if (rating === 'NC17') {
                this.showAgeVerification();
            }
            
            // Update game state and reload current dialogue
            Game.state.contentFilters.rating = rating;
            if (Game.systems.dialogue.currentDialogue) {
                Game.systems.dialogue.presentDialogue(
                    Game.state.currentCharacter,
                    Game.state.currentNode
                );
            }
        });
    }

    updateRatingDescription(rating) {
        const descriptions = document.querySelectorAll('.rating-description p');
        descriptions.forEach(desc => desc.classList.remove('active'));
        document.querySelector(`.${rating}-description`).classList.add('active');
    }

    showAgeVerification() {
        const isAdult = confirm('This content contains strong language and mature themes. Please confirm you are 18 or older.');
        if (!isAdult) {
            document.getElementById('content-rating').value = 'CLEAN';
            this.updateRatingDescription('CLEAN');
            Game.state.contentFilters.rating = 'CLEAN';
        }
    }

    toggleGameMenu() {
        const gameMenu = document.querySelector('.game-menu');
        this.gameMenuActive = !this.gameMenuActive;
        gameMenu.classList.toggle('active', this.gameMenuActive);
    }

    saveSettings() {
        // Get all settings values
        const settings = {
            musicVolume: document.getElementById('music-volume').value,
            sfxVolume: document.getElementById('sfx-volume').value,
            textSize: document.getElementById('text-size').value,
            darkMode: document.getElementById('dark-mode').checked,
            autoSave: document.getElementById('auto-save').checked,
            textSpeed: document.getElementById('text-speed').value,
            contentRating: document.getElementById('content-rating').value,
            contentWarning: document.getElementById('content-warning').checked
        };

        // Save to localStorage
        localStorage.setItem('gameSettings', JSON.stringify(settings));
        alert('Settings saved!');
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('gameSettings'));
        if (settings) {
            document.getElementById('music-volume').value = settings.musicVolume;
            document.getElementById('sfx-volume').value = settings.sfxVolume;
            document.getElementById('text-size').value = settings.textSize;
            document.getElementById('dark-mode').checked = settings.darkMode;
            document.getElementById('auto-save').checked = settings.autoSave;
            document.getElementById('text-speed').value = settings.textSpeed;
            document.getElementById('content-rating').value = settings.contentRating || 'T';
            document.getElementById('content-warning').checked = settings.contentWarnings ?? true;
            this.updateRatingDescription(settings.contentRating || 'T');
        }
    }

    quitToMenu() {
        if (confirm('Are you sure you want to quit? Unsaved progress will be lost.')) {
            this.toggleGameMenu();
            this.showScreen('main-menu');
        }
    }

    selectCharacter(card) {
        console.log('Selecting character:', card.dataset.character);
        
        // Remove selection from all cards
        document.querySelectorAll('.character-card').forEach(c => {
            c.classList.remove('selected');
        });

        // Add selection to clicked card
        card.classList.add('selected');
        this.selectedCharacter = card.dataset.character;

        // Enable start button
        const startButton = document.getElementById('start-journey');
        if (startButton) {
            startButton.removeAttribute('disabled');
            startButton.classList.add('active');
        }
    }

    startGame() {
        console.log('Starting new game...');
        if (this.selectedCharacter) {
            try {
                // Show game container first
                this.showScreen('game-container');
                
                // Initialize game with selected character
                this.game.initialize(this.selectedCharacter).then(() => {
                    console.log('Game initialized successfully');
                }).catch(error => {
                    console.error('Error initializing game:', error);
                    alert('Error starting game');
                    this.showScreen('main-menu');
                });
            } catch (error) {
                console.error('Error starting game:', error);
                alert('Error starting game');
                this.showScreen('main-menu');
            }
        } else {
            console.warn('No character selected');
            alert('Please select a character first');
        }
    }

    continueGame() {
        console.log('Attempting to continue game...');
        try {
            const savedState = localStorage.getItem('gameState');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                this.game = new Game();
                this.game.state = gameState;
                this.showScreen('game-container');
                console.log('Game continued successfully');
            } else {
                console.warn('No saved game found');
                alert('No saved game found!');
            }
        } catch (error) {
            console.error('Error continuing game:', error);
            alert('Error loading saved game');
        }
    }

    showCredits() {
        // Implement credits screen
        console.log('Credits screen not implemented yet');
    }

    // Add to Game state initialization
    initializeContentFilters() {
        Game.state.contentFilters = {
            rating: document.getElementById('content-rating').value,
            showWarnings: document.getElementById('content-warning').checked
        };
    }

    initializeCarousel() {
        const container = document.querySelector('.carousel-container');
        const cards = document.querySelector('.character-cards');
        const cardElements = document.querySelectorAll('.character-card');
        const dots = document.querySelectorAll('.carousel-dot');
        let currentIndex = 0;

        // Set initial state
        updateCarousel();

        function updateCarousel() {
            // Update transform
            cards.style.transform = `translateX(-${currentIndex * 50}%)`; // Use 50% for each card

            // Update active states
            cardElements.forEach((card, index) => {
                card.classList.toggle('active', index === currentIndex);
            });

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            // Update buttons
            document.querySelector('.prev-button').disabled = currentIndex === 0;
            document.querySelector('.next-button').disabled = currentIndex === cardElements.length - 1;
        }

        // Button Navigation
        document.querySelector('.next-button').addEventListener('click', () => {
            currentIndex = Math.min(currentIndex + 1, cardElements.length - 1);
            updateCarousel();
        });

        document.querySelector('.prev-button').addEventListener('click', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateCarousel();
        });

        // Touch/Swipe Support
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            cards.style.transition = 'none';
        });

        container.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const deltaX = e.touches[0].clientX - currentX;
            currentX = e.touches[0].clientX;
            
            const currentOffset = -100 * currentIndex;
            const newOffset = currentOffset + (deltaX / container.offsetWidth) * 100;
            cards.style.transform = `translateX(${newOffset}%)`;
        });

        container.addEventListener('touchend', (e) => {
            const deltaX = currentX - startX;
            
            cards.style.transition = 'transform 0.3s ease-in-out';
            
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (deltaX < 0 && currentIndex < cardElements.length - 1) {
                    currentIndex++;
                }
            }
            
            updateCarousel();
            startX = null;
        });

        // Dot Navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }

    async loadAllCharacters() {
        const characterList = ['billy', 'nettie'];
        for (const charId of characterList) {
            try {
                const data = await this.assetLoader.loadCharacter(charId);
                this.characters[charId] = data;
                this.updateCharacterCard(charId, data);
            } catch (error) {
                console.error(`Error loading character ${charId}:`, error);
            }
        }
    }

    updateCharacterCard(charId, data) {
        const card = document.querySelector(`[data-character="${charId}"]`);
        if (!card) return;

        // Update card content with data
        const portrait = card.querySelector('.character-portrait img');
        if (portrait) {
            portrait.onerror = () => {
                // Use the AssetLoader's default placeholder
                portrait.src = this.assetLoader.defaultPlaceholder;
            };
            portrait.src = `/assets/images/characters/${charId}.png`;
        }

        const name = card.querySelector('.character-info h3');
        const desc = card.querySelector('.character-desc');
        const traits = card.querySelector('.character-traits');

        if (name) name.textContent = data.name;
        if (desc) desc.textContent = data.description;

        // Update traits if they exist
        if (traits && data.traits) {
            traits.innerHTML = data.traits.map(trait => `
                <li>
                    <span class="trait-name">${trait.name}</span>
                    <span class="trait-desc">${trait.description}</span>
                </li>
            `).join('');
        }
    }

    async showInventory(character) {
        if (!character || !this.characters[character]) return;
        
        const charData = this.characters[character];
        const inventoryScreen = document.querySelector('.inventory-screen');
        
        // Set character-specific styling
        inventoryScreen.dataset.character = character;
        
        // Update header
        inventoryScreen.querySelector('h2').textContent = `${charData.name}'s Inventory`;
        
        // Clear and populate grid
        inventoryScreen.querySelector('.inventory-grid').innerHTML = '';
        charData.inventory.forEach(item => {
            const itemCard = this.createItemCard(item);
            inventoryScreen.querySelector('.inventory-grid').appendChild(itemCard);
        });

        inventoryScreen.classList.add('active');
    }

    async showAbilities(character) {
        if (!character || !this.characters[character]) return;
        
        const charData = this.characters[character];
        const abilitiesScreen = document.querySelector('.abilities-screen');
        
        // Set character-specific styling
        abilitiesScreen.dataset.character = character;
        
        // Update header
        abilitiesScreen.querySelector('h2').textContent = `${charData.name}'s Abilities`;
        
        // Clear and populate grid
        abilitiesScreen.querySelector('.abilities-grid').innerHTML = '';
        charData.abilities.forEach(ability => {
            const abilityCard = this.createAbilityCard(ability);
            abilitiesScreen.querySelector('.abilities-grid').appendChild(abilityCard);
        });

        abilitiesScreen.classList.add('active');
    }

    createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.itemId = item.id;
        
        card.innerHTML = `
            <div class="icon icon-${item.type || 'item'}"></div>
            <div class="item-info">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
            </div>
        `;

        card.addEventListener('click', () => this.showItemDetails(item));
        return card;
    }

    createAbilityCard(ability) {
        const card = document.createElement('div');
        card.className = 'ability-card';
        card.dataset.abilityId = ability.id;
        
        card.innerHTML = `
            <div class="icon-container">
                <img src="assets/icons/${ability.icon}" alt="${ability.name}">
            </div>
            <div class="ability-info">
                <h3 class="ability-name">${ability.name}</h3>
                <p class="ability-description">${ability.description}</p>
                <span class="type-tag type-${ability.type}">${ability.type}</span>
                ${ability.cooldown ? 
                    `<span class="cooldown">${ability.cooldown}s</span>` : ''}
            </div>
        `;

        card.addEventListener('click', () => this.showAbilityDetails(ability));
        return card;
    }

    async loadCharacterData(character) {
        try {
            const response = await fetch(`assets/characters/${character}.json`);
            if (!response.ok) throw new Error('Failed to load character data');
            return await response.json();
        } catch (error) {
            console.error('Error loading character data:', error);
            return { inventory: [], abilities: [] };
        }
    }

    createIconElement(type) {
        return `<div class="icon-container">
            <img src="/assets/images/icons/${type}.png" alt="${type}">
        </div>`;
    }

    createGearSlot(type) {
        return `<div class="gear-slot" data-slot="${type}"></div>`;
    }
}

// Initialize menu system
window.addEventListener('DOMContentLoaded', () => {
    window.menuManager = new MenuManager();
});

export { MenuManager }; 