class DialogueManager {
    constructor(game) {
        this.game = game;
        this.storyContainer = document.getElementById('story');
        this.choicesContainer = document.getElementById('choices');
        this.currentDialogue = null;
        this.initializeListeners();
    }

    initializeListeners() {
        // Listen for choice clicks
        this.choicesContainer.addEventListener('click', (e) => {
            const choiceBtn = e.target.closest('button');
            if (choiceBtn) {
                const choiceId = choiceBtn.dataset.choiceId;
                this.handleChoice(choiceId);
            }
        });
    }

    async loadDialogue(characterId, nodeId) {
        try {
            const response = await fetch(`/assets/dialogue/${characterId}.json`);
            const dialogueData = await response.json();
            return dialogueData.nodes[nodeId];
        } catch (error) {
            console.error('Error loading dialogue:', error);
            return null;
        }
    }

    async presentDialogue(characterId, nodeId) {
        const dialogueNode = await this.loadDialogue(characterId, nodeId);
        if (!dialogueNode) return;

        this.currentDialogue = dialogueNode;
        
        // Update story text
        const storyText = document.createElement('p');
        storyText.textContent = dialogueNode.text;
        this.storyContainer.appendChild(storyText);
        
        // Scroll to latest text
        this.storyContainer.scrollTop = this.storyContainer.scrollHeight;

        // Update choices
        this.choicesContainer.innerHTML = dialogueNode.choices
            .map(choice => `
                <button data-choice-id="${choice.id}" class="choice-btn">
                    ${choice.text}
                </button>
            `).join('');

        // Check for quest triggers
        if (dialogueNode.questTrigger) {
            this.game.questManager.triggerQuest(dialogueNode.questTrigger);
        }
    }

    async handleChoice(choiceId) {
        const choice = this.currentDialogue.choices.find(c => c.id === choiceId);
        if (!choice) return;

        // Add choice to story
        const choiceText = document.createElement('p');
        choiceText.className = 'player-choice';
        choiceText.textContent = choice.text;
        this.storyContainer.appendChild(choiceText);

        // Handle choice effects
        if (choice.effects) {
            this.handleEffects(choice.effects);
        }

        // Move to next dialogue node
        if (choice.nextNode) {
            await this.presentDialogue(this.game.state.currentCharacter, choice.nextNode);
        }
    }

    handleEffects(effects) {
        if (effects.quest) {
            this.game.questManager.updateQuest(effects.quest);
        }
        if (effects.relationship) {
            this.game.state.relationships[effects.relationship.character] = 
                (this.game.state.relationships[effects.relationship.character] || 0) + 
                effects.relationship.change;
        }
        if (effects.emotion) {
            this.updateEmotionTracker(effects.emotion);
        }
    }

    updateEmotionTracker(emotion) {
        const emotionTracker = document.querySelector('.emotion-tracker');
        const emotionIndicator = document.createElement('div');
        emotionIndicator.className = `emotion ${emotion.type}`;
        emotionIndicator.innerHTML = `
            <img src="/assets/images/emotions/${emotion.type}.png" alt="${emotion.type}"
                 onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='">
            <span>${emotion.type}</span>
        `;
        emotionTracker.appendChild(emotionIndicator);
    }
}

export { DialogueManager }; 