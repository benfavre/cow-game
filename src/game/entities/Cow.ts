import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import { getAssetManager } from '@/game/GameManager';

/**
 * Cow entity - the main character controlled by the player
 */
export class Cow {
  // Physics body
  private body: Matter.Body;
  
  // Visual representation
  private sprite: PIXI.Sprite;
  private container: PIXI.Container;
  
  // State
  private isLaunched: boolean = false;
  private isGrounded: boolean = true;
  private hasBounced: boolean = false;
  private startX: number = 0;
  private distanceTraveled: number = 0;
  private initialPosition: { x: number, y: number } = { x: 0, y: 0 };
  
  // Physics properties
  private size = { width: 64, height: 48 };
  
  /**
   * Create a new cow entity
   * @param parent - The parent container
   * @param engine - The physics engine
   */
  constructor(parent: PIXI.Container, engine: Matter.Engine) {
    // Create container for the cow and its parts
    this.container = new PIXI.Container();
    
    // Try to load cow texture from assets
    let texture: PIXI.Texture = PIXI.Texture.WHITE;
    try {
      const assetManager = getAssetManager();
      const cowTexture = assetManager.getTexture('cow');
      if (cowTexture) {
        texture = cowTexture as PIXI.Texture; // Type assertion
      }
    } catch (error) {
      console.warn('Could not load cow texture, using fallback:', error);
    }
    
    // Create sprite
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.width = this.size.width;
    this.sprite.height = this.size.height;
    this.sprite.anchor.set(0.5);
    
    // Use tint only if using the white texture
    if (texture === PIXI.Texture.WHITE) {
      this.sprite.tint = 0xF5F5DC; // Light cream color
    }
    
    this.container.addChild(this.sprite);
    
    // Only add spots if using white texture
    if (texture === PIXI.Texture.WHITE) {
      this.addSpots();
    }
    
    // Add container to parent
    parent.addChild(this.container);
    
    // Create physics body
    this.body = Matter.Bodies.rectangle(
      0,
      0,
      this.size.width,
      this.size.height,
      {
        label: 'cow',
        density: 0.001,
        friction: 0.1,
        restitution: 0.3,
        collisionFilter: {
          category: 0x0001,
          mask: 0xFFFF,
        },
      }
    );
    
    // Add body to world
    Matter.Composite.add(engine.world, this.body);
    
    // Set initial position
    this.setPosition(100, 100);
  }
  
  /**
   * Add spots to the cow
   */
  private addSpots(): void {
    // Add spots as graphics objects
    const spots = [
      { x: -15, y: -10, radius: 8 },
      { x: 10, y: 5, radius: 10 },
      { x: -5, y: 15, radius: 7 },
      { x: 15, y: -8, radius: 6 },
    ];
    
    for (const spot of spots) {
      const spotGraphic = new PIXI.Graphics();
      spotGraphic.beginFill(0x000000);
      spotGraphic.drawCircle(spot.x, spot.y, spot.radius);
      spotGraphic.endFill();
      this.container.addChild(spotGraphic);
    }
    
    // Add eyes
    const leftEye = new PIXI.Graphics();
    leftEye.beginFill(0x000000);
    leftEye.drawCircle(-15, -15, 3);
    leftEye.endFill();
    this.container.addChild(leftEye);
    
    const rightEye = new PIXI.Graphics();
    rightEye.beginFill(0x000000);
    rightEye.drawCircle(-5, -15, 3);
    rightEye.endFill();
    this.container.addChild(rightEye);
    
    // Add mouth
    const mouth = new PIXI.Graphics();
    mouth.lineStyle(2, 0x000000);
    mouth.moveTo(-20, -5);
    mouth.lineTo(-10, 0);
    mouth.lineTo(-20, 5);
    this.container.addChild(mouth);
  }
  
  /**
   * Set the position of the cow
   * @param x - X position
   * @param y - Y position
   */
  public setPosition(x: number, y: number): void {
    Matter.Body.setPosition(this.body, { x, y });
    this.initialPosition = { x, y };
    this.startX = x;
  }
  
  /**
   * Get the position of the cow
   * @returns Position coordinates
   */
  public getPosition(): { x: number, y: number } {
    return { x: this.body.position.x, y: this.body.position.y };
  }
  
  /**
   * Launch the cow with a force
   * @param forceX - Horizontal force component
   * @param forceY - Vertical force component
   */
  public launch(forceX: number, forceY: number): void {
    if (!this.isLaunched) {
      this.isLaunched = true;
      this.isGrounded = false;
      Matter.Body.setStatic(this.body, false);
      Matter.Body.applyForce(this.body, this.body.position, { x: forceX, y: forceY });
      
      // Play moo sound if available
      try {
        const assetManager = getAssetManager();
        assetManager.playSound('moo', 0.5);
      } catch (error) {
        console.warn('Could not play moo sound:', error);
      }
    }
  }
  
  /**
   * Get the distance traveled by the cow
   * @returns Distance in pixels
   */
  public getDistanceTraveled(): number {
    return this.distanceTraveled;
  }
  
  /**
   * Check if the cow has landed
   * @returns Whether the cow has landed
   */
  public hasLanded(): boolean {
    return this.isLaunched && this.isGrounded;
  }
  
  /**
   * Check if the cow has bounced
   * @returns Whether the cow has bounced
   */
  public hasBounce(): boolean {
    return this.hasBounced;
  }
  
  /**
   * Handle collision with a trampoline
   * @param bounceFactor - Bounce force multiplier
   */
  public bounce(bounceFactor: number = 1.5): void {
    this.hasBounced = true;
    Matter.Body.setVelocity(this.body, {
      x: this.body.velocity.x,
      y: -Math.abs(this.body.velocity.y) * bounceFactor
    });
    
    // Play bounce sound if available
    try {
      const assetManager = getAssetManager();
      assetManager.playSound('bounce', 0.5);
    } catch (error) {
      console.warn('Could not play bounce sound:', error);
    }
  }
  
  /**
   * Update the cow
   * @param delta - Time elapsed since last frame
   */
  public update(delta: number): void {
    // Update position from physics body
    if (this.body) {
      this.container.position.set(this.body.position.x, this.body.position.y);
      this.container.rotation = this.body.angle;
      
      // Track distance traveled
      this.distanceTraveled = Math.max(0, this.body.position.x - this.startX);
      
      // Check if grounded
      this.checkGrounded();
      
      // Apply rotation based on velocity if in air
      if (!this.isGrounded && this.isLaunched) {
        Matter.Body.setAngularVelocity(this.body, this.body.velocity.x * 0.0005);
      }
    }
  }
  
  /**
   * Check if the cow is grounded
   */
  private checkGrounded(): void {
    if (this.isLaunched) {
      // Simple ground check - can be improved with proper collision detection
      const minVelocity = 0.5;
      if (
        Math.abs(this.body.velocity.x) < minVelocity && 
        Math.abs(this.body.velocity.y) < minVelocity && 
        this.body.position.y > this.initialPosition.y
      ) {
        this.isGrounded = true;
        
        // Play impact sound when landing
        if (this.isGrounded) {
          try {
            const assetManager = getAssetManager();
            assetManager.playSound('impact', 0.3);
          } catch (error) {
            console.warn('Could not play impact sound:', error);
          }
        }
      }
    }
  }
} 