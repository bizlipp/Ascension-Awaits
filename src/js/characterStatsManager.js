class CharacterStatsManager {
    constructor(game) {
        this.game = game;
        this.screen = document.querySelector('.character-stats-screen');
        console.log('CharacterStatsManager initialized', { game, screen: this.screen });
        if (this.screen) {
            this.initializeListeners();
        } else {
            console.warn('Character stats screen element not found');
        }
    }

    initializeListeners() {
        // Character Stats Button
        const statsBtn = document.getElementById('character-stats-btn');
        if (statsBtn) {
            console.log('Adding click listener to character stats button');
            statsBtn.addEventListener('click', () => {
                console.log('Character stats button clicked');
                this.showStats(this.game.state.currentCharacter);
            });
        }

        // Close button
        const closeBtn = this.screen.querySelector('.close-button');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Close button clicked');
                this.hideStats();
            });
        }
    }

    showStats(characterId) {
        console.log('Showing stats for character:', characterId);
        if (!this.screen) {
            console.error('Character stats screen not found');
            return;
        }

        // Show the screen
        this.screen.classList.add('active');
        this.screen.style.display = 'flex';

        const character = this.game.state.characters[characterId] || {
            name: characterId,
            powerScore: 3810,
            rank: 7,
            rankStars: 5,
            requiredLevel: 30,
            level: 45,
            maxLevel: 45,
            gear: {
                weapon: { icon: 'weapon.png' },
                armor: { icon: 'armor.png' },
                accessory: { icon: 'accessory.png' }
            },
            powers: [
                {
                    name: "Pin Enemy",
                    icon: "pin-enemy.png",
                    level: 5,
                    maxLevel: 7
                }
            ]
        };

        console.log('Character data:', character);
        
        // Update character name and power score
        document.querySelector('.character-name').textContent = character.name;
        document.querySelector('.score-value').textContent = character.powerScore.toLocaleString();

        // Update character model
        const modelImg = document.querySelector('.character-model img');
        modelImg.onerror = () => {
            modelImg.src = this.game.menuManager.assetLoader.defaultPlaceholder;
        };
        modelImg.src = `/assets/images/characters/${characterId}.png`;

        // Update gear slots
        Object.entries(character.gear).forEach(([slot, item]) => {
            const gearSlot = document.querySelector(`.gear-slot[data-slot="${slot}"]`);
            if (gearSlot && item) {
                gearSlot.innerHTML = `<img src="/assets/images/icons/${item.icon}" alt="${slot}"
                    onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='">`;
            }
        });

        // Update rank and level
        document.querySelector('.rank').textContent = character.rank;
        document.querySelector('.rank-stars').textContent = '★'.repeat(character.rankStars);
        document.querySelector('.rank-progress').textContent = 
            `Required Hero Level ${character.requiredLevel}`;
        document.querySelector('.current-level').textContent = 
            `LVL ${character.level}`;
        
        if (character.level >= character.maxLevel) {
            document.querySelector('.max-level').style.display = 'block';
            document.querySelector('.level-progress').style.display = 'none';
        }

        // Update powers
        const powersGrid = document.querySelector('.powers-grid');
        powersGrid.innerHTML = character.powers.map(power => this.createPowerSlot(power)).join('');
    }

    createPowerSlot(power) {
        return `
            <div class="power-slot">
                <div class="power-icon">
                    <img src="/assets/images/icons/${power.icon}" alt="${power.name}">
                </div>
                <div class="power-info">
                    <span class="power-name">${power.name}</span>
                    <span class="power-level">LEVEL ${power.level}/${power.maxLevel}</span>
                </div>
            </div>
        `;
    }

    hideStats() {
        if (!this.screen) return;
        
        this.screen.classList.remove('active');
        setTimeout(() => {
            if (!this.screen.classList.contains('active')) {
                this.screen.style.display = 'none';
            }
        }, 300); // Match the CSS transition duration
    }

    updateCharacterStats(character) {
        const statsContainer = document.querySelector('.character-stats');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <div class="character-header">
                <div class="icon-container">
                    <img src="/assets/images/icons/character.png" alt="Character">
                </div>
                <h2>${character.name}</h2>
            </div>
            <div class="stats-grid">
                ${this.createStatsGrid(character.stats)}
            </div>
        `;
    }

    createEquipmentSlot(type, item) {
        return `
            <div class="equipment-slot ${item ? 'icon-' + item.type : ''}" data-type="${type}"></div>
        `;
    }
}

export { CharacterStatsManager }; 