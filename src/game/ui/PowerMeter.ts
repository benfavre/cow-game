import * as PIXI from 'pixi.js';

/**
 * Power meter UI component for showing launch power
 */
export class PowerMeter {
  // Parent container
  private container: PIXI.Container;
  
  // UI elements
  private background: PIXI.Graphics;
  private fill: PIXI.Graphics;
  private text: PIXI.Text;
  
  // Properties
  private width: number = 200;
  private height: number = 30;
  private currentValue: number = 0;
  private maxValue: number = 100;
  private isVisible: boolean = false;
  
  /**
   * Create a new power meter
   * @param parent - The parent container
   */
  constructor(parent: PIXI.Container) {
    // Create container
    this.container = new PIXI.Container();
    
    // Add background
    this.background = new PIXI.Graphics();
    this.background.beginFill(0x333333);
    this.background.drawRect(0, 0, this.width, this.height);
    this.background.endFill();
    this.container.addChild(this.background);
    
    // Add fill
    this.fill = new PIXI.Graphics();
    this.container.addChild(this.fill);
    
    // Add text
    this.text = new PIXI.Text('0%', {
      fontFamily: 'Nunito',
      fontSize: 16,
      fill: 0xFFFFFF,
      align: 'center',
    });
    this.text.anchor.set(0.5);
    this.text.position.set(this.width / 2, this.height / 2);
    this.container.addChild(this.text);
    
    // Add container to parent
    parent.addChild(this.container);
    
    // Set initial position and visibility
    this.resize(window.innerWidth, window.innerHeight);
    this.container.visible = this.isVisible;
  }
  
  /**
   * Set the power value
   * @param value - The power value (0-100)
   */
  public setValue(value: number): void {
    this.currentValue = Math.max(0, Math.min(this.maxValue, value));
    this.updateVisuals();
  }
  
  /**
   * Show the power meter
   */
  public show(): void {
    this.isVisible = true;
    this.container.visible = true;
  }
  
  /**
   * Hide the power meter
   */
  public hide(): void {
    this.isVisible = false;
    this.container.visible = false;
  }
  
  /**
   * Update the visuals based on the current value
   */
  private updateVisuals(): void {
    // Calculate fill percentage
    const fillPercentage = this.currentValue / this.maxValue;
    const fillWidth = this.width * fillPercentage;
    
    // Update fill graphics
    this.fill.clear();
    
    // Determine color based on power level
    let fillColor: number;
    if (fillPercentage < 0.33) {
      fillColor = 0x00FF00; // Green
    } else if (fillPercentage < 0.66) {
      fillColor = 0xFFFF00; // Yellow
    } else {
      fillColor = 0xFF0000; // Red
    }
    
    // Draw fill
    this.fill.beginFill(fillColor);
    this.fill.drawRect(0, 0, fillWidth, this.height);
    this.fill.endFill();
    
    // Update text
    this.text.text = `${Math.floor(fillPercentage * 100)}%`;
  }
  
  /**
   * Resize the power meter
   * @param width - New screen width
   * @param height - New screen height
   */
  public resize(width: number, height: number): void {
    // Position the power meter at the bottom center of the screen
    this.container.position.set(
      (width - this.width) / 2,
      height - this.height - 20
    );
  }
} 