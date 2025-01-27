import { MenuManager } from './menuManager.js';
import { Game } from './game.js';

class App {
    static async initialize() {
        try {
            console.log('Initializing app...');
            
            // Initialize splash screen
            const splashScreen = document.getElementById('splash-screen');
            const mainMenu = document.getElementById('main-menu');
            
            if (!splashScreen || !mainMenu) {
                console.error('Required screens not found');
                return;
            }
            
            // Handle splash screen click
            splashScreen.addEventListener('click', (e) => {
                console.log('Splash screen clicked');
                e.preventDefault();
                e.stopPropagation();
                
                splashScreen.classList.remove('active');
                splashScreen.classList.add('hidden');
                mainMenu.classList.remove('hidden');
                mainMenu.classList.add('active');
                
                // Remove the splash screen from DOM after transition
                setTimeout(() => {
                    if (splashScreen && splashScreen.parentNode) {
                        splashScreen.remove();
                        console.log('Splash screen removed from DOM');
                    }
                }, 300);
            });
            
            console.log('Splash screen click handler added');
            
            // Main menu buttons
            document.getElementById('new-game').addEventListener('click', () => {
                if (!mainMenu) {
                    console.error('Main menu element not found');
                    return;
                }
                mainMenu.classList.remove('active');
                mainMenu.classList.add('hidden');
                // Only initialize character select when needed
                this.initializeCharacterSelect();
            });
            
            document.getElementById('continue-game').addEventListener('click', () => {
                console.log('Continue clicked');
            });
            
            document.getElementById('settings').addEventListener('click', () => {
                console.log('Settings clicked');
            });
            
            document.getElementById('back-to-menu').addEventListener('click', () => {
                console.log('Back clicked - returning to main menu');
                characterSelect.classList.remove('active');
                mainMenu.classList.add('active');
            });
            
            // Enable start button when character is selected
            document.querySelectorAll('.character-card').forEach(card => {
                console.log('Adding click handler to card:', card.dataset.character);
                card.addEventListener('click', () => {
                    console.log('Card clicked:', card.dataset.character);
                    document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    document.getElementById('start-journey').disabled = false;
                });
            });
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    static async initializeCharacterSelect() {
        const characterSelect = document.getElementById('character-select');
        const mainMenu = document.getElementById('main-menu');
        
        if (!characterSelect) {
            console.error('Character select screen not found');
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
                mainMenu.classList.add('active');
            }
            return;
        }

        characterSelect.classList.remove('hidden');
        characterSelect.classList.add('active');

        try {
            // Initialize character select functionality
            const game = new Game();
            window.Game = game;
            const menuManager = new MenuManager(game);
            window.menuManager = menuManager;
            console.log('Character select initialized successfully');
        } catch (error) {
            console.error('Error initializing character select:', error);
            // Revert to main menu on error
            if (mainMenu) {
                mainMenu.classList.remove('hidden');
                mainMenu.classList.add('active');
            }
            characterSelect.classList.remove('active');
            characterSelect.classList.add('hidden');
        }
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.initialize());
} else {
    App.initialize();
}

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
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
            };
        }
    });
} 