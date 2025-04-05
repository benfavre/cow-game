import * as PIXI from 'pixi.js';

// Asset types
export type AssetType = 'texture' | 'spritesheet' | 'sound' | 'font';

// Asset definition
export interface AssetDefinition {
  name: string;
  url: string;
  type: AssetType;
}

// Game assets
const GAME_ASSETS: AssetDefinition[] = [
  // Textures
  { name: 'cow', url: '/assets/sprites/cow.png', type: 'texture' },
  { name: 'trampoline', url: '/assets/sprites/trampoline.png', type: 'texture' },
  { name: 'ground', url: '/assets/sprites/ground.png', type: 'texture' },
  { name: 'sky', url: '/assets/sprites/sky.png', type: 'texture' },
  { name: 'cloud', url: '/assets/sprites/cloud.png', type: 'texture' },
  { name: 'rock', url: '/assets/sprites/rock.png', type: 'texture' },
  { name: 'tree', url: '/assets/sprites/tree.png', type: 'texture' },
  { name: 'barn', url: '/assets/sprites/barn.png', type: 'texture' },
  
  // Spritesheets
  { name: 'cow-animations', url: '/assets/spritesheets/cow-animations.json', type: 'spritesheet' },
  { name: 'effects', url: '/assets/spritesheets/effects.json', type: 'spritesheet' },
  
  // Sounds
  { name: 'moo', url: '/assets/sounds/moo.mp3', type: 'sound' },
  { name: 'bounce', url: '/assets/sounds/bounce.mp3', type: 'sound' },
  { name: 'wind', url: '/assets/sounds/wind.mp3', type: 'sound' },
  { name: 'impact', url: '/assets/sounds/impact.mp3', type: 'sound' },
];

/**
 * Asset manager to handle loading and caching game assets
 */
export class AssetManager {
  private textures: Map<string, PIXI.Texture> = new Map();
  private spritesheets: Map<string, PIXI.Spritesheet> = new Map();
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isLoaded: boolean = false;
  
  /**
   * Load all game assets
   * @returns Promise that resolves when all assets are loaded
   */
  public async loadAssets(): Promise<void> {
    if (this.isLoaded) {
      console.warn('Assets are already loaded');
      return;
    }
    
    // Create PIXI loader
    try {
      // Load textures and spritesheets
      await this.loadPixiAssets();
      
      // Load sounds
      await this.loadSounds();
      
      this.isLoaded = true;
      console.log('All assets loaded successfully');
    } catch (error) {
      console.error('Error loading assets:', error);
      throw error;
    }
  }
  
  /**
   * Load PIXI assets (textures and spritesheets)
   */
  private async loadPixiAssets(): Promise<void> {
    const textureAssets = GAME_ASSETS.filter(asset => asset.type === 'texture');
    const spritesheetAssets = GAME_ASSETS.filter(asset => asset.type === 'spritesheet');
    
    // Load textures
    for (const asset of textureAssets) {
      try {
        const texture = await PIXI.Assets.load(asset.url);
        this.textures.set(asset.name, texture);
      } catch (error) {
        console.error(`Error loading texture ${asset.name}:`, error);
        throw error;
      }
    }
    
    // Load spritesheets
    for (const asset of spritesheetAssets) {
      try {
        const spritesheet = await PIXI.Assets.load(asset.url);
        this.spritesheets.set(asset.name, spritesheet);
      } catch (error) {
        console.error(`Error loading spritesheet ${asset.name}:`, error);
        throw error;
      }
    }
  }
  
  /**
   * Load sounds
   */
  private async loadSounds(): Promise<void> {
    const soundAssets = GAME_ASSETS.filter(asset => asset.type === 'sound');
    
    // Load sounds
    const soundPromises = soundAssets.map(asset => {
      return new Promise<void>((resolve, reject) => {
        const audio = new Audio(asset.url);
        audio.addEventListener('canplaythrough', () => {
          this.sounds.set(asset.name, audio);
          resolve();
        });
        audio.addEventListener('error', (error) => {
          reject(new Error(`Error loading sound ${asset.name}: ${error}`));
        });
        audio.load();
      });
    });
    
    await Promise.all(soundPromises);
  }
  
  /**
   * Get a texture by name
   * @param name - The texture name
   * @returns The texture or null if not found
   */
  public getTexture(name: string): PIXI.Texture | null {
    return this.textures.get(name) || null;
  }
  
  /**
   * Get a spritesheet by name
   * @param name - The spritesheet name
   * @returns The spritesheet or null if not found
   */
  public getSpritesheet(name: string): PIXI.Spritesheet | null {
    return this.spritesheets.get(name) || null;
  }
  
  /**
   * Get a sound by name
   * @param name - The sound name
   * @returns The sound or null if not found
   */
  public getSound(name: string): HTMLAudioElement | null {
    return this.sounds.get(name) || null;
  }
  
  /**
   * Play a sound by name
   * @param name - The sound name
   * @param volume - The volume (0-1)
   * @param loop - Whether to loop the sound
   * @returns The sound element or null if not found
   */
  public playSound(name: string, volume: number = 1, loop: boolean = false): HTMLAudioElement | null {
    const sound = this.getSound(name);
    if (sound) {
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = volume;
      soundClone.loop = loop;
      soundClone.play().catch(error => console.error(`Error playing sound ${name}:`, error));
      return soundClone;
    }
    return null;
  }
} 