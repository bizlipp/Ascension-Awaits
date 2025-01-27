# Mystara: Ascension Awaits - Project Structure

## Core Files
- index.html
- style.css
- app.js
- data.json

## Assets Directory

### Quests
- Character Quests
- Dynamic Quest Examples

### Characters
- Player Characters
  - Billy
  - Nyx
  - Jinx
- NPCs
  - Navigator Prime
  - Echo Wanderer
  - Gateway Keeper
  - Assistant Claude
  - Advisory Council
  - Architect
- System Notes

### Dialogue
#### Main Characters
- Navigator Prime
- Echo Wanderer
- Gateway Keeper
- Billy
- Nettie
- Timbr
- Case Worker
- Circle of Elders
- Dreamweavers
- Lumindras
- Predatory Hunters
- Edgar
- Jinx
- Landlord Murray
- Overseer
- Assistant Claude
- Assistant Claude (Forest)

#### Archive of Echoes
- Chief Archivist Dialogue
- Master Weaver Dialogue
- Reflection Guide Dialogue

#### Rift of Fates
- Forge Master Dialogue
- Grand Weaver Dialogue
- Pathfinder Dialogue

### Locations

#### Earth
- Billy's Apartment
- Forgotten Alley
- Construction Site

#### Afterlife Placement Center
- Waiting Room
- Processing Office
- Records Archive
- Placement Portal

#### Mystara
- Everbloom Fields
- Withered Peaks
- Mirrorwood
- Aurora Well
- Council Grounds
- Whispergates

#### Umbraxis
- Black Market Nexus
- Obsidian Canyons
- Echoing Spires
- Veil Flats
- Forgotten Sanctuary

#### Veilway
- Veilway Nexus
- Gate Terminus

#### Archive of Echoes
- Grand Repository
- Reflection Chambers
- Weavers Sanctum

#### Rift of Fates
- Crossroads of Destiny
- Temporal Forge
- Weavers Sanctum

### NPCs

#### Archive of Echoes
- Master Weaver

#### Rift of Fates
- Pathfinder
- Forge Master
- Grand Weaver

#### Veilway
- Gatekeeper

### Additional Resources
- The Nexus of Computation
- Whispering Code Forest
- Earth Crossing
- Emotions Definitions

# Project Structure

## Build Output
/dist               # Production build
  /js              # Compiled JavaScript
  /css             # Compiled CSS
  /assets          # Copied assets

## Source Files
/src
  /js              # JavaScript source
  /css             # CSS source
  /assets          # Game assets
  /data            # Game data

## Asset Organization
- Characters: /src/assets/characters/
- Dialogue: /src/assets/dialogue/[world]/
- Locations: /src/assets/locations/[world]/
- Images: /src/assets/images/

## Code Organization
- Game Logic: /src/js/game.js
- Asset Loading: /src/js/assetLoader.js
- Dialogue System: /src/js/dialogueManager.js
- Menu System: /src/js/menuManager.js
- State Management: /src/js/state.js 