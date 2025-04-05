import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { GameScene } from './../game/scenes/GameScene';
import { InputManager } from '@/core/InputManager';
import { AssetManager } from '@/core/AssetManager';

// Global game configuration
export const GAME_CONFIG = {
  physics: {
    gravity: { x: 0, y: 1 },
    airResistance: 0.1,
    bounceEfficiency: 0.7,
  },
  power: {
    min: 0,
    max: 100,
    chargeRate: 2,
  },
  angle: {
    min: 0,
    max: 90,
    step: 1,
  },
};

// Core game manager
let app: PIXI.Application;
let physicsEngine: Matter.Engine;
let currentScene: GameScene | null = null;
let inputManager: InputManager;
export let assetManager: AssetManager; // Exported for global access

/**
 * Initialize the game
 * @param container - The HTML element to attach the game to
 * @param onGameOver - Callback function to execute when the game is over
 * @returns A cleanup function
 */
export function initGame(container: HTMLElement, onGameOver: () => void): () => void {
  // Initialize PixiJS application
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
  });
  
  container.appendChild(app.view as HTMLCanvasElement);
  
  // Initialize Matter.js physics engine
  physicsEngine = Matter.Engine.create({
    gravity: GAME_CONFIG.physics.gravity,
  });
  
  // Initialize managers
  inputManager = new InputManager();
  assetManager = new AssetManager();
  
  // Load assets
  assetManager.loadAssets().then(() => {
    try {
      // Create game scene
      currentScene = new GameScene(app, physicsEngine, onGameOver);
      app.stage.addChild(currentScene);
      
      // Start game loop
      app.ticker.add(gameLoop);
      
      // Set up event listeners
      setupEventListeners();
    } catch (error) {
      console.error("Error initializing game:", error);
    }
  }).catch(error => {
    console.error("Error loading assets:", error);
  });
  
  // Return cleanup function
  return () => {
    app.ticker.remove(gameLoop);
    app.destroy(true, { children: true, texture: true, baseTexture: true });
    Matter.Engine.clear(physicsEngine);
    removeEventListeners();
    currentScene = null;
  };
}

/**
 * Get the asset manager instance
 * @returns The asset manager
 */
export function getAssetManager(): AssetManager {
  return assetManager;
}

/**
 * Main game loop
 * @param delta - Time elapsed since last frame
 */
function gameLoop(delta: number): void {
  // Update physics
  Matter.Engine.update(physicsEngine, delta * 16.67); // Convert to ms (assuming 60fps)
  
  // Update current scene
  if (currentScene) {
    currentScene.update(delta);
  }
}

/**
 * Set up event listeners
 */
function setupEventListeners(): void {
  window.addEventListener('resize', handleResize);
  inputManager.setup(app);
}

/**
 * Remove event listeners
 */
function removeEventListeners(): void {
  window.removeEventListener('resize', handleResize);
  inputManager.cleanup();
}

/**
 * Handle window resize
 */
function handleResize(): void {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  
  if (currentScene) {
    currentScene.resize(window.innerWidth, window.innerHeight);
  }
} 