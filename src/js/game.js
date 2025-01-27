import { InventoryManager } from './inventoryManager.js';
import { CharacterStatsManager } from './characterStatsManager.js';
import { DialogueManager } from './dialogueManager.js';
import { QuestManager } from './questManager.js';

class Game {
    state = {
        currentCharacter: null,
        currentNode: null,
        currentLocation: null,
        inventory: {
            items: [],
            maxSize: 20,
            equipped: new Map()
        },
        questLog: [],
        relationships: {},
        emotions: {},
        contentFilters: {
            rating: 'CLEAN',
            showWarnings: true
        },
        characters: {}
    };

    systems = {
        dialogue: null,
        quests: null,
        locations: null,
        characters: null,
        assetLoader: null
    };

    async initialize(character) {
        console.log('Game initializing with character:', character);
        await this.initAssets();
        await this.initState(character);
        await this.initSystems();

        // Initialize managers
        this.inventoryManager = new InventoryManager(this);
        this.characterStatsManager = new CharacterStatsManager(this);
        this.dialogueManager = new DialogueManager(this);
        this.questManager = new QuestManager(this);

        // Add starter items based on character
        if (character === 'billy') {
            this.addItem({
                id: 'glitch-pendant',
                name: 'Glitch Pendant',
                description: 'A mysterious pendant that resonates with The Glitch.',
                icon: 'assets/images/icons/glitch-pendant.png',
                equippable: true,
                slot: 'neck',
                stats: {
                    intuition: 2,
                    coding: 1
                }
            });
        }
    }

    async initAssets() {
        this.systems.assetLoader = new AssetLoader();
        await this.systems.assetLoader.preloadAssets();
    }

    async initState(character) {
        this.state.currentCharacter = character;
        this.state.currentNode = 'initial_encounter';
        this.state.characters = {
            [character]: {
                name: character,
                rank: 1,
                rankStars: 1,
                requiredLevel: 1,
                level: 1,
                powers: [
                    {
                        name: "Basic Attack",
                        icon: "basic-attack.png",
                        level: 1,
                        maxLevel: 7
                    }
                ]
            }
        };
    }

    async initSystems() {
        this.systems.dialogue = new DialogueManager();
        await this.systems.dialogue.presentDialogue(
            this.state.currentCharacter, 
            this.state.currentNode
        );
    }

    initQuickAccessButtons() {
        // Character Stats button handler
        const statsBtn = document.getElementById('character-stats-btn');
        if (statsBtn) {
            console.log('Initializing character stats button');
            statsBtn.addEventListener('click', () => {
                console.log('Character stats button clicked');
                if (this.characterStatsManager) {
                    this.characterStatsManager.showStats(this.state.currentCharacter);
                } else {
                    console.warn('CharacterStatsManager not initialized');
                    // Initialize if needed
                    this.characterStatsManager = new CharacterStatsManager(this);
                    this.characterStatsManager.showStats(this.state.currentCharacter);
                }
            });
        } else {
            console.warn('Character stats button not found');
        }
    }

    // Inventory management methods
    addItem(item) {
        if (this.state.inventory.items.length < this.state.inventory.maxSize) {
            // Ensure item has an icon, use placeholder if not
            if (!item.icon) {
                item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
            }
            this.state.inventory.items.push(item);
            return true;
        }
        return false;
    }

    removeItem(itemId) {
        const index = this.state.inventory.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            return this.state.inventory.items.splice(index, 1)[0];
        }
        return null;
    }

    equipItem(itemId) {
        const item = this.state.inventory.items.find(item => item.id === itemId);
        if (item && item.equippable) {
            if (this.state.inventory.equipped.has(item.slot)) {
                this.unequipItem(item.slot);
            }
            this.state.inventory.equipped.set(item.slot, item);
            item.equipped = true;
        }
    }

    unequipItem(slot) {
        const item = this.state.inventory.equipped.get(slot);
        if (item) {
            item.equipped = false;
            this.state.inventory.equipped.delete(slot);
        }
    }
}

export { Game }; 