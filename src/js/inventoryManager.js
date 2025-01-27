class InventoryManager {
    constructor(game) {
        this.game = game;
        this.container = document.querySelector('.inventory-grid');
        this.detailPanel = document.querySelector('.detail-panel');
        this.screen = document.querySelector('.inventory-screen');
        this.initializeListeners();
    }

    initializeListeners() {
        // Item selection
        this.container.addEventListener('click', (e) => {
            const itemCard = e.target.closest('.item-card');
            if (itemCard) {
                this.showItemDetails(itemCard.dataset.itemId);
            }
        });

        // Action buttons
        this.detailPanel.querySelector('.action-use').addEventListener('click', () => {
            this.useSelectedItem();
        });

        this.detailPanel.querySelector('.action-equip').addEventListener('click', () => {
            this.toggleEquipSelectedItem();
        });
    }

    showItemDetails(itemId) {
        const item = this.game.state.inventory.items.find(i => i.id === itemId);
        if (!item) return;

        this.selectedItem = item;
        this.detailPanel.querySelector('.detail-title').textContent = item.name;
        this.detailPanel.querySelector('.detail-description').textContent = item.description;
        
        const statsHtml = Object.entries(item.stats || {})
            .map(([stat, value]) => `<div class="stat">${stat}: ${value > 0 ? '+' : ''}${value}</div>`)
            .join('');
        
        this.detailPanel.querySelector('.detail-stats').innerHTML = statsHtml;
        this.detailPanel.classList.add('active');

        // Update action buttons
        const equipBtn = this.detailPanel.querySelector('.action-equip');
        equipBtn.textContent = item.equipped ? 'Unequip' : 'Equip';
        equipBtn.style.display = item.equippable ? 'block' : 'none';
    }

    updateInventoryDisplay() {
        this.container.innerHTML = this.game.state.inventory.items
            .map(item => this.createInventoryItem(item))
            .join('');
    }

    createInventoryItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.dataset.itemId = item.id;
        
        itemElement.innerHTML = `
            <div class="icon-container">
                <img src="/assets/images/icons/${item.type || 'item'}.png" alt="${item.name}">
            </div>
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-description">${item.description}</span>
            </div>
        `;
        return itemElement;
    }

    toggleEquipSelectedItem() {
        if (!this.selectedItem || !this.selectedItem.equippable) return;

        if (this.selectedItem.equipped) {
            this.game.state.unequipItem(this.selectedItem.slot);
        } else {
            this.game.state.equipItem(this.selectedItem.id);
        }

        this.updateInventoryDisplay();
        this.showItemDetails(this.selectedItem.id);
    }

    useSelectedItem() {
        if (!this.selectedItem || !this.selectedItem.usable) return;

        // Implement item use effects here
        console.log(`Using item: ${this.selectedItem.name}`);
    }

    showInventory() {
        this.screen.classList.add('active');
        this.updateInventoryDisplay();
    }

    hideInventory() {
        this.screen.classList.remove('active');
        this.detailPanel.classList.remove('active');
    }
}

export { InventoryManager }; 