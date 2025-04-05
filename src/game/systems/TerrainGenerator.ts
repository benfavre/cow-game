import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';

/**
 * Generates and manages the game terrain
 */
export class TerrainGenerator {
  // Core components
  private container: PIXI.Container;
  private physicsEngine: Matter.Engine;
  
  // Terrain properties
  private terrainSegments: TerrainSegment[] = [];
  private segmentWidth: number = 200;
  private groundHeight: number = 50;
  private worldWidth: number = 0;
  private startX: number = 0;
  
  // Terrain features
  private trampolines: Matter.Body[] = [];
  private obstacles: Matter.Body[] = [];
  
  // Visual elements
  private groundGraphics: PIXI.Graphics;
  
  // Generation settings
  private seed: number = Math.random() * 1000;
  private noiseScale: number = 0.01;
  private heightVariation: number = 100;
  
  /**
   * Create a new terrain generator
   * @param container - The container to add terrain visuals to
   * @param engine - The physics engine
   */
  constructor(container: PIXI.Container, engine: Matter.Engine) {
    this.container = container;
    this.physicsEngine = engine;
    
    // Create ground graphics
    this.groundGraphics = new PIXI.Graphics();
    this.container.addChild(this.groundGraphics);
    
    // Set world width based on screen width
    this.worldWidth = window.innerWidth * 2;
  }
  
  /**
   * Generate initial terrain
   */
  public generateInitialTerrain(): void {
    // Clear existing terrain
    this.clearTerrain();
    
    // Generate new terrain segments
    const numSegments = Math.ceil(this.worldWidth / this.segmentWidth) + 5;
    
    for (let i = 0; i < numSegments; i++) {
      const x = i * this.segmentWidth;
      const height = this.getTerrainHeight(x);
      
      this.terrainSegments.push({
        x,
        width: this.segmentWidth,
        height,
        body: this.createTerrainBody(x, height)
      });
    }
    
    // Draw the terrain
    this.drawTerrain();
    
    // Add some trampolines and obstacles
    this.addTerrain();
  }
  
  /**
   * Clear all terrain
   */
  private clearTerrain(): void {
    // Remove physics bodies
    for (const segment of this.terrainSegments) {
      Matter.Composite.remove(this.physicsEngine.world, segment.body);
    }
    
    // Clear trampolines
    for (const trampoline of this.trampolines) {
      Matter.Composite.remove(this.physicsEngine.world, trampoline);
    }
    
    // Clear obstacles
    for (const obstacle of this.obstacles) {
      Matter.Composite.remove(this.physicsEngine.world, obstacle);
    }
    
    // Clear arrays
    this.terrainSegments = [];
    this.trampolines = [];
    this.obstacles = [];
    
    // Clear graphics
    this.groundGraphics.clear();
  }
  
  /**
   * Create a physics body for a terrain segment
   * @param x - X position of the segment
   * @param height - Height of the segment
   * @returns The physics body
   */
  private createTerrainBody(x: number, height: number): Matter.Body {
    const y = window.innerHeight - height / 2;
    
    // Create a static rectangle for the terrain
    const body = Matter.Bodies.rectangle(
      x + this.segmentWidth / 2,
      y,
      this.segmentWidth,
      height,
      {
        isStatic: true,
        label: 'ground',
        friction: 0.5,
        restitution: 0.2,
        collisionFilter: {
          category: 0x0002,
          mask: 0xFFFF,
        },
      }
    );
    
    // Add to world
    Matter.Composite.add(this.physicsEngine.world, body);
    
    return body;
  }
  
  /**
   * Get the height of the terrain at a given x position
   * @param x - X position
   * @returns The terrain height
   */
  private getTerrainHeight(x: number): number {
    // Simple sine wave terrain for now - can be replaced with proper noise function
    const baseHeight = this.groundHeight;
    const noiseValue = Math.sin((x + this.seed) * this.noiseScale);
    return baseHeight + noiseValue * this.heightVariation;
  }
  
  /**
   * Draw the terrain
   */
  private drawTerrain(): void {
    this.groundGraphics.clear();
    
    // Draw ground
    this.groundGraphics.beginFill(0x8B4513); // Brown color
    
    // Draw each segment
    for (const segment of this.terrainSegments) {
      const x = segment.x;
      const y = window.innerHeight - segment.height;
      const width = segment.width;
      const height = segment.height;
      
      this.groundGraphics.drawRect(x, y, width, height);
    }
    
    // Draw grass on top
    this.groundGraphics.beginFill(0x7CFC00); // Grass green
    for (const segment of this.terrainSegments) {
      const x = segment.x;
      const y = window.innerHeight - segment.height;
      const width = segment.width;
      
      this.groundGraphics.drawRect(x, y, width, 10);
    }
    
    this.groundGraphics.endFill();
  }
  
  /**
   * Add trampolines and obstacles to the terrain
   */
  private addTerrain(): void {
    // Add trampolines
    for (let i = 1; i < this.terrainSegments.length - 1; i += 3) {
      const segment = this.terrainSegments[i];
      const x = segment.x + segment.width / 2;
      const y = window.innerHeight - segment.height - 10;
      
      this.addTrampoline(x, y);
    }
    
    // Add obstacles
    for (let i = 2; i < this.terrainSegments.length - 1; i += 4) {
      const segment = this.terrainSegments[i];
      const x = segment.x + segment.width / 2;
      const y = window.innerHeight - segment.height - 30;
      
      this.addObstacle(x, y);
    }
  }
  
  /**
   * Add a trampoline at the specified position
   * @param x - X position
   * @param y - Y position
   */
  private addTrampoline(x: number, y: number): void {
    // Create trampoline body
    const trampolineBody = Matter.Bodies.rectangle(
      x,
      y,
      60,
      10,
      {
        isStatic: true,
        label: 'trampoline',
        friction: 0.1,
        restitution: 1.5, // High bounce factor
        collisionFilter: {
          category: 0x0004,
          mask: 0xFFFF,
        },
      }
    );
    
    // Add to world
    Matter.Composite.add(this.physicsEngine.world, trampolineBody);
    this.trampolines.push(trampolineBody);
    
    // Create visual representation
    const trampoline = new PIXI.Graphics();
    trampoline.beginFill(0xFF0000); // Red color
    trampoline.drawRect(-30, -5, 60, 10);
    trampoline.endFill();
    trampoline.position.set(x, y);
    this.container.addChild(trampoline);
  }
  
  /**
   * Add an obstacle at the specified position
   * @param x - X position
   * @param y - Y position
   */
  private addObstacle(x: number, y: number): void {
    // Create obstacle body
    const obstacleBody = Matter.Bodies.rectangle(
      x,
      y,
      30,
      60,
      {
        isStatic: true,
        label: 'obstacle',
        friction: 0.5,
        restitution: 0.2,
        collisionFilter: {
          category: 0x0008,
          mask: 0xFFFF,
        },
      }
    );
    
    // Add to world
    Matter.Composite.add(this.physicsEngine.world, obstacleBody);
    this.obstacles.push(obstacleBody);
    
    // Create visual representation
    const obstacle = new PIXI.Graphics();
    obstacle.beginFill(0x654321); // Dark brown
    obstacle.drawRect(-15, -30, 30, 60);
    obstacle.endFill();
    obstacle.position.set(x, y);
    this.container.addChild(obstacle);
  }
  
  /**
   * Update the terrain based on the player's position
   * @param delta - Time elapsed since last frame
   * @param playerX - Player's X position
   */
  public update(delta: number, playerX: number): void {
    // Check if we need to generate more terrain
    const lastSegment = this.terrainSegments[this.terrainSegments.length - 1];
    if (lastSegment && playerX > lastSegment.x - this.worldWidth / 2) {
      this.generateMoreTerrain();
    }
    
    // Remove terrain that's far behind the player
    this.cleanupTerrain(playerX);
    
    // Update terrain visuals (parallax scrolling, etc.)
    this.updateVisuals(playerX);
  }
  
  /**
   * Generate more terrain as the player moves forward
   */
  private generateMoreTerrain(): void {
    const lastSegment = this.terrainSegments[this.terrainSegments.length - 1];
    const startX = lastSegment.x + lastSegment.width;
    
    // Generate a few more segments
    const numNewSegments = 5;
    
    for (let i = 0; i < numNewSegments; i++) {
      const x = startX + i * this.segmentWidth;
      const height = this.getTerrainHeight(x);
      
      this.terrainSegments.push({
        x,
        width: this.segmentWidth,
        height,
        body: this.createTerrainBody(x, height)
      });
      
      // Randomly add trampolines or obstacles
      if (Math.random() < 0.3) {
        this.addTrampoline(x + this.segmentWidth / 2, window.innerHeight - height - 10);
      } else if (Math.random() < 0.2) {
        this.addObstacle(x + this.segmentWidth / 2, window.innerHeight - height - 30);
      }
    }
    
    // Redraw terrain
    this.drawTerrain();
  }
  
  /**
   * Remove terrain that's far behind the player
   * @param playerX - Player's X position
   */
  private cleanupTerrain(playerX: number): void {
    // Remove segments that are far behind the player
    const removeDistance = this.worldWidth / 2;
    
    // Keep removing until we find a segment that's not too far behind
    while (
      this.terrainSegments.length > 0 && 
      this.terrainSegments[0].x + this.terrainSegments[0].width < playerX - removeDistance
    ) {
      const segment = this.terrainSegments.shift();
      if (segment) {
        Matter.Composite.remove(this.physicsEngine.world, segment.body);
      }
    }
    
    // Also clean up trampolines and obstacles
    this.trampolines = this.trampolines.filter(trampoline => {
      const pos = trampoline.position;
      if (pos.x < playerX - removeDistance) {
        Matter.Composite.remove(this.physicsEngine.world, trampoline);
        return false;
      }
      return true;
    });
    
    this.obstacles = this.obstacles.filter(obstacle => {
      const pos = obstacle.position;
      if (pos.x < playerX - removeDistance) {
        Matter.Composite.remove(this.physicsEngine.world, obstacle);
        return false;
      }
      return true;
    });
  }
  
  /**
   * Update terrain visuals
   * @param playerX - Player's X position
   */
  private updateVisuals(playerX: number): void {
    // For now, just redraw the terrain
    // Could be optimized to only update what's changed
    this.drawTerrain();
  }
}

/**
 * Terrain segment interface
 */
interface TerrainSegment {
  x: number;
  width: number;
  height: number;
  body: Matter.Body;
} 