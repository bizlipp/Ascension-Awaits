class QuestManager {
    constructor(game) {
        this.game = game;
        this.questList = document.querySelector('.quest-list');
        this.activeQuests = new Map();
    }

    async loadQuestData(questId) {
        try {
            const response = await fetch(`/assets/quests/character_quests.json`);
            const questData = await response.json();
            return questData.quests[questId];
        } catch (error) {
            console.error('Error loading quest data:', error);
            return null;
        }
    }

    async triggerQuest(questId) {
        const questData = await this.loadQuestData(questId);
        if (!questData) return;

        this.activeQuests.set(questId, {
            ...questData,
            progress: 0,
            status: 'active'
        });

        this.updateQuestDisplay();
    }

    updateQuest(questUpdate) {
        const quest = this.activeQuests.get(questUpdate.id);
        if (!quest) return;

        quest.progress = questUpdate.progress;
        if (quest.progress >= quest.requiredProgress) {
            quest.status = 'complete';
        }

        this.updateQuestDisplay();
    }

    updateQuestDisplay() {
        this.questList.innerHTML = '';
        
        for (const [id, quest] of this.activeQuests) {
            const questElement = document.createElement('div');
            questElement.className = `quest-item ${quest.status}`;
            questElement.innerHTML = `
                <div class="quest-icon">
                    <img src="/assets/images/icons/${quest.icon}" alt="${quest.title}"
                         onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='">
                </div>
                <h4>${quest.title}</h4>
                <p>${quest.description}</p>
                <div class="quest-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(quest.progress / quest.requiredProgress) * 100}%"></div>
                    </div>
                    <span>${quest.progress}/${quest.requiredProgress}</span>
                </div>
            `;
            this.questList.appendChild(questElement);
        }
    }
} 