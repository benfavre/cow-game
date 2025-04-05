import * as PIXI from 'pixi.js';

/**
 * UI overlay for displaying score and game info
 */
export class UIOverlay {
  // Parent container
  private container: PIXI.Container;
  
  // UI elements
  private scoreText: PIXI.Text;
  private distanceText: PIXI.Text;
  private background: PIXI.Graphics;
  
  /**
   * Create a new UI overlay
   * @param parent - The parent container
   */
  constructor(parent: PIXI.Container) {
    // Create container for UI elements
    this.container = new PIXI.Container();
    
    // Add background
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000, 0.5);
    this.background.drawRect(0, 0, 200, 80);
    this.background.endFill();
    this.container.addChild(this.background);
    
    // Add score text
    this.scoreText = new PIXI.Text('Score: 0', {
      fontFamily: 'Luckiest Guy',
      fontSize: 24,
      fill: 0xFFFFFF,
      align: 'left',
    });
    this.scoreText.position.set(10, 10);
    this.container.addChild(this.scoreText);
    
    // Add distance text
    this.distanceText = new PIXI.Text('Distance: 0m', {
      fontFamily: 'Nunito',
      fontSize: 18,
      fill: 0xFFFFFF,
      align: 'left',
    });
    this.distanceText.position.set(10, 40);
    this.container.addChild(this.distanceText);
    
    // Add container to parent
    parent.addChild(this.container);
    
    // Set initial position
    this.resize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * Update the UI
   * @param delta - Time elapsed since last frame
   * @param score - Current score
   * @param distance - Current distance (optional)
   */
  public update(delta: number, score: number, distance?: number): void {
    // Update score text
    this.scoreText.text = `Score: ${score}`;
    
    // Update distance text if provided
    if (distance !== undefined) {
      this.distanceText.text = `Distance: ${Math.floor(distance / 10)}m`;
    }
  }
  
  /**
   * Resize the UI
   * @param width - New width
   * @param height - New height
   */
  public resize(width: number, height: number): void {
    // Position the UI in the top-left corner with some padding
    this.container.position.set(20, 20);
  }
} 