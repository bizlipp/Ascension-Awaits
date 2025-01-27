export class GameState {
    constructor() {
        this.inventory = {
            items: [],
            maxSize: 20,
            equipped: new Map()
        };
        
        this.stats = {
            health: 100,
            energy: 100,
            coding: 1,
            intuition: 1,
            resilience: 1,
            creativity: 1
        };
    }

    addItem(item) {
        if (this.inventory.items.length < this.inventory.maxSize) {
            // Ensure item has an icon, use placeholder if not
            if (!item.icon) {
                item.icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
            }
            this.inventory.items.push(item);
            return true;
        }
        return false;
    }

    removeItem(itemId) {
        const index = this.inventory.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            return this.inventory.items.splice(index, 1)[0];
        }
        return null;
    }

    equipItem(itemId) {
        const item = this.inventory.items.find(item => item.id === itemId);
        if (item && item.equippable) {
            if (this.inventory.equipped.has(item.slot)) {
                this.unequipItem(item.slot);
            }
            this.inventory.equipped.set(item.slot, item);
            item.equipped = true;
            this.updateStats();
        }
    }

    unequipItem(slot) {
        const item = this.inventory.equipped.get(slot);
        if (item) {
            item.equipped = false;
            this.inventory.equipped.delete(slot);
            this.updateStats();
        }
    }

    updateStats() {
        // Reset base stats
        this.stats = {
            health: 100,
            energy: 100,
            coding: 1,
            intuition: 1,
            resilience: 1,
            creativity: 1
        };

        // Apply equipment bonuses
        for (const [_, item] of this.inventory.equipped) {
            if (item.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    if (this.stats.hasOwnProperty(stat)) {
                        this.stats[stat] += value;
                    }
                }
            }
        }
    }

    static save() {
        localStorage.setItem('gameState', JSON.stringify(Game.state));
    }
    
    static load() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            Object.assign(Game.state, JSON.parse(savedState));
        }
    }
    
    static update(changes) {
        Object.assign(Game.state, changes);
        this.save();
    }
} 