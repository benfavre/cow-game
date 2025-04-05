import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { Cow } from './../entities/Cow';
import { TerrainGenerator } from './../systems/TerrainGenerator';
import { GAME_CONFIG } from '../GameManager';
import { ScoreManager } from './../systems/ScoreManager';
import { UIOverlay } from './../ui/UIOverlay';
import { PowerMeter } from './../ui/PowerMeter';
import { AngleIndicator } from './../ui/AngleIndicator';

/**
 * Main game scene
 */
export class GameScene extends PIXI.Container {
  // Core components
  private app: PIXI.Application;
  private physicsEngine: Matter.Engine;
  private onGameOver: () => void;
  
  // Game entities
  private cow: Cow | null = null;
  private terrainGenerator: TerrainGenerator | null = null;
  private scoreManager: ScoreManager | null = null;
  
  // UI components
  private uiOverlay: UIOverlay | null = null;
  private powerMeter: PowerMeter | null = null;
  private angleIndicator: AngleIndicator | null = null;
  
  // Game state
  private isPowerCharging: boolean = false;
  private currentPower: number = 0;
  private currentAngle: number = 45; // Default angle
  private isLaunched: boolean = false;
  private gameEnded: boolean = false;
  
  // Layers
  private backgroundLayer: PIXI.Container;
  private terrainLayer: PIXI.Container;
  private entityLayer: PIXI.Container;
  private uiLayer: PIXI.Container;
  
  /**
   * Create the game scene
   * @param app - PIXI Application instance
   * @param physicsEngine - Matter.js physics engine
   * @param onGameOver - Callback function to execute when the game is over
   */
  constructor(app: PIXI.Application, physicsEngine: Matter.Engine, onGameOver: () => void) {
    super();
    
    // Set up core components
    this.app = app;
    this.physicsEngine = physicsEngine;
    this.onGameOver = onGameOver;
    
    // Create layers
    this.backgroundLayer = new PIXI.Container();
    this.terrainLayer = new PIXI.Container();
    this.entityLayer = new PIXI.Container();
    this.uiLayer = new PIXI.Container();
    
    // Add layers to scene
    this.addChild(this.backgroundLayer);
    this.addChild(this.terrainLayer);
    this.addChild(this.entityLayer);
    this.addChild(this.uiLayer);
    
    // Set up game systems
    this.setupGame();
  }
  
  /**
   * Set up the game
   */
  private setupGame(): void {
    // Create terrain generator
    this.terrainGenerator = new TerrainGenerator(this.terrainLayer, this.physicsEngine);
    
    // Create cow
    this.cow = new Cow(this.entityLayer, this.physicsEngine);
    
    // Create score manager
    this.scoreManager = new ScoreManager();
    
    // Create UI components
    this.uiOverlay = new UIOverlay(this.uiLayer);
    this.powerMeter = new PowerMeter(this.uiLayer);
    this.angleIndicator = new AngleIndicator(this.uiLayer);
    
    // Set up event listeners for game controls
    this.setupEventListeners();
    
    // Generate initial terrain
    this.terrainGenerator.generateInitialTerrain();
    
    // Set the cow at the starting position
    this.cow.setPosition(100, 500);
  }
  
  /**
   * Set up event listeners for game controls
   */
  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }
  
  /**
   * Handle key down event
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    switch (event.key.toLowerCase()) {
      case ' ': // Space bar
        if (!this.isLaunched) {
          this.startChargingPower();
        }
        break;
      case 'arrowup':
        if (!this.isLaunched) {
          this.adjustAngle(this.currentAngle + GAME_CONFIG.angle.step);
        }
        break;
      case 'arrowdown':
        if (!this.isLaunched) {
          this.adjustAngle(this.currentAngle - GAME_CONFIG.angle.step);
        }
        break;
    }
  };
  
  /**
   * Handle key up event
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    switch (event.key.toLowerCase()) {
      case ' ': // Space bar
        if (!this.isLaunched && this.isPowerCharging) {
          this.launchCow();
        }
        break;
    }
  };
  
  /**
   * Start charging power for the cow launch
   */
  private startChargingPower(): void {
    this.isPowerCharging = true;
    this.currentPower = GAME_CONFIG.power.min;
    if (this.powerMeter) {
      this.powerMeter.show();
      this.powerMeter.setValue(this.currentPower);
    }
  }
  
  /**
   * Adjust the launch angle
   * @param angle - The new angle
   */
  private adjustAngle(angle: number): void {
    // Clamp angle between min and max
    this.currentAngle = Math.max(
      GAME_CONFIG.angle.min,
      Math.min(GAME_CONFIG.angle.max, angle)
    );
    
    if (this.angleIndicator) {
      this.angleIndicator.setAngle(this.currentAngle);
    }
  }
  
  /**
   * Launch the cow with the current power and angle
   */
  private launchCow(): void {
    this.isPowerCharging = false;
    this.isLaunched = true;
    
    if (this.powerMeter) {
      this.powerMeter.hide();
    }
    
    if (this.cow) {
      // Convert angle from degrees to radians
      const angleRad = (this.currentAngle * Math.PI) / 180;
      
      // Calculate force components
      const forceX = Math.cos(angleRad) * this.currentPower * 0.1;
      const forceY = -Math.sin(angleRad) * this.currentPower * 0.1;
      
      // Apply force to cow
      this.cow.launch(forceX, forceY);
    }
  }
  
  /**
   * End the game
   */
  private endGame(): void {
    if (!this.gameEnded) {
      this.gameEnded = true;
      
      // Calculate final score
      if (this.cow && this.scoreManager) {
        const distance = this.cow.getDistanceTraveled();
        this.scoreManager.setDistance(distance);
        console.log(`Game over! Distance: ${distance}, Score: ${this.scoreManager.getTotalScore()}`);
      }
      
      // Remove event listeners
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      
      // Call the game over callback
      setTimeout(() => {
        this.onGameOver();
      }, 2000);
    }
  }
  
  /**
   * Update the scene
   * @param delta - Time elapsed since last frame
   */
  public update(delta: number): void {
    if (this.gameEnded) {
      return;
    }
    
    // Update power if charging
    if (this.isPowerCharging) {
      this.currentPower += GAME_CONFIG.power.chargeRate * delta;
      if (this.currentPower > GAME_CONFIG.power.max) {
        this.currentPower = GAME_CONFIG.power.max;
      }
      
      if (this.powerMeter) {
        this.powerMeter.setValue(this.currentPower);
      }
    }
    
    // Update cow
    if (this.cow) {
      this.cow.update(delta);
      
      // Check if cow has landed
      if (this.isLaunched && this.cow.hasLanded()) {
        this.endGame();
      }
    }
    
    // Update terrain
    if (this.terrainGenerator && this.cow && this.isLaunched) {
      this.terrainGenerator.update(delta, this.cow.getPosition().x);
    }
    
    // Update UI
    if (this.uiOverlay && this.scoreManager) {
      this.uiOverlay.update(delta, this.scoreManager.getTotalScore());
    }
  }
  
  /**
   * Resize the scene
   * @param width - New width
   * @param height - New height
   */
  public resize(width: number, height: number): void {
    // Resize UI components
    if (this.uiOverlay) {
      this.uiOverlay.resize(width, height);
    }
    
    if (this.powerMeter) {
      this.powerMeter.resize(width, height);
    }
    
    if (this.angleIndicator) {
      this.angleIndicator.resize(width, height);
    }
  }
} 