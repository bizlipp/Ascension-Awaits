class AssetLoader {
    constructor() {
        this.cache = {
            images: new Map(),
            json: new Map(),
            characters: new Map()
        };
        this.preloadQueue = new Set();
        this.loadingPromises = new Map();
        
        // Base64 encoded 1x1 gray pixel as default placeholder
        this.defaultPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    }

    // Preload essential assets
    async preloadAssets() {
        try {
            // Essential character data
            this.preloadQueue.add('assets/characters/billy.json');
            this.preloadQueue.add('assets/characters/nettie.json');

            // Only load existing character images
            this.preloadQueue.add('assets/images/characters/billy.png');
            this.preloadQueue.add('assets/images/characters/nettie.png');

            // Load all queued assets
            const loadPromises = Array.from(this.preloadQueue).map(path => {
                if (path.endsWith('.json')) {
                    return this.loadJSON(path);
                } else if (path.includes('/billy.png') || path.includes('/nettie.png')) {
                    return this.loadImage(path);
                }
                return Promise.resolve();
            });

            const results = await Promise.allSettled(loadPromises);
            const failures = results.filter(r => r.status === 'rejected');
            if (failures.length > 0) {
                console.warn(`${failures.length} assets failed to load`);
            }
        } catch (error) {
            console.error('Error in preloadAssets:', error);
            throw error;
        }
    }

    // Load and cache an image
    async loadImage(path) {
        if (this.cache.images.has(path)) {
            return this.cache.images.get(path);
        }

        try {
            const img = new Image();
            img.src = path;
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => {
                    console.warn(`Failed to load image: ${path}, using placeholder`);
                    img.src = this.defaultPlaceholder;
                    resolve();
                };
            });
            
            this.cache.images.set(path, img);
            return img;
        } catch (error) {
            console.error(`Error loading image: ${path}`, error);
            const placeholderImg = new Image();
            placeholderImg.src = this.defaultPlaceholder;
            return placeholderImg;
        }
    }

    // Load and cache JSON data
    async loadJSON(path) {
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }

        if (this.cache.json.has(path)) {
            return this.cache.json.get(path);
        }

        const loadPromise = fetch(`/dist/assets/${path}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                this.cache.json.set(path, data);
                this.loadingPromises.delete(path);
                return data;
            })
            .catch(error => {
                this.loadingPromises.delete(path);
                throw error;
            });

        this.loadingPromises.set(path, loadPromise);
        return loadPromise;
    }

    // Load character data with caching
    async loadCharacter(characterId) {
        if (this.cache.characters.has(characterId)) {
            return this.cache.characters.get(characterId);
        }

        const data = await this.loadJSON(`characters/${characterId.toLowerCase()}.json`);
        this.cache.characters.set(characterId, data);
        
        // Preload character assets
        if (data.inventory) {
            data.inventory.forEach(item => {
                this.preloadQueue.add(item.icon);
            });
        }
        if (data.abilities) {
            data.abilities.forEach(ability => {
                this.preloadQueue.add(ability.icon);
            });
        }

        return data;
    }

    // Clear specific cache
    clearCache(type) {
        if (type) {
            this.cache[type].clear();
        } else {
            Object.values(this.cache).forEach(cache => cache.clear());
        }
    }

    // Get cache stats
    getCacheStats() {
        return {
            images: this.cache.images.size,
            json: this.cache.json.size,
            characters: this.cache.characters.size,
            loading: this.loadingPromises.size,
            queued: this.preloadQueue.size
        };
    }

    async loadAllCharacters() {
        console.log('Loading character data...');
        try {
            const characterFiles = ['billy.json', 'nettie.json'];
            const loadPromises = characterFiles.map(async file => {
                const path = `characters/${file}`;
                console.log(`Loading character: ${path}`);
                const data = await this.loadJSON(path);
                console.log(`Loaded character data:`, data);
                return data;
            });

            const characters = await Promise.all(loadPromises);
            console.log('All characters loaded:', characters);
            return characters;
        } catch (error) {
            console.error('Error loading characters:', error);
            throw error;
        }
    }
}

// Export the AssetLoader class
export { AssetLoader }; 