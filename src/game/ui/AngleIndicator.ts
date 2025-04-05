import * as PIXI from 'pixi.js';

/**
 * Angle indicator UI component for showing launch angle
 */
export class AngleIndicator {
  // Parent container
  private container: PIXI.Container;
  
  // UI elements
  private background: PIXI.Graphics;
  private line: PIXI.Graphics;
  private text: PIXI.Text;
  
  // Properties
  private radius: number = 60;
  private currentAngle: number = 45; // Default angle
  private lineLength: number = 80;
  
  /**
   * Create a new angle indicator
   * @param parent - The parent container
   */
  constructor(parent: PIXI.Container) {
    // Create container
    this.container = new PIXI.Container();
    
    // Add background
    this.background = new PIXI.Graphics();
    this.drawBackground();
    this.container.addChild(this.background);
    
    // Add angle line
    this.line = new PIXI.Graphics();
    this.drawLine();
    this.container.addChild(this.line);
    
    // Add text
    this.text = new PIXI.Text('45°', {
      fontFamily: 'Nunito',
      fontSize: 16,
      fill: 0xFFFFFF,
      align: 'center',
    });
    this.text.anchor.set(0.5);
    this.text.position.set(0, -this.radius - 20);
    this.container.addChild(this.text);
    
    // Add container to parent
    parent.addChild(this.container);
    
    // Set initial position
    this.resize(window.innerWidth, window.innerHeight);
  }
  
  /**
   * Set the angle
   * @param angle - The angle in degrees (0-90)
   */
  public setAngle(angle: number): void {
    this.currentAngle = Math.max(0, Math.min(90, angle));
    this.updateVisuals();
  }
  
  /**
   * Update the visuals based on the current angle
   */
  private updateVisuals(): void {
    this.drawLine();
    this.text.text = `${Math.floor(this.currentAngle)}°`;
  }
  
  /**
   * Draw the background
   */
  private drawBackground(): void {
    this.background.clear();
    
    // Draw semi-circle background
    this.background.lineStyle(2, 0xFFFFFF, 0.5);
    this.background.arc(0, 0, this.radius, 0, Math.PI, false);
    
    // Draw tick marks
    for (let angle = 0; angle <= 90; angle += 15) {
      const radians = (angle * Math.PI) / 180;
      const xStart = Math.cos(radians) * this.radius;
      const yStart = -Math.sin(radians) * this.radius;
      const xEnd = Math.cos(radians) * (this.radius - 8);
      const yEnd = -Math.sin(radians) * (this.radius - 8);
      
      this.background.lineStyle(angle % 45 === 0 ? 3 : 1, 0xFFFFFF, 0.8);
      this.background.moveTo(xStart, yStart);
      this.background.lineTo(xEnd, yEnd);
    }
  }
  
  /**
   * Draw the angle line
   */
  private drawLine(): void {
    this.line.clear();
    
    // Convert angle to radians
    const radians = (this.currentAngle * Math.PI) / 180;
    
    // Calculate end point
    const xEnd = Math.cos(radians) * this.lineLength;
    const yEnd = -Math.sin(radians) * this.lineLength;
    
    // Draw line
    this.line.lineStyle(3, 0xFF0000);
    this.line.moveTo(0, 0);
    this.line.lineTo(xEnd, yEnd);
    
    // Draw arrowhead
    const arrowSize = 10;
    const arrowAngle = Math.PI / 8;
    
    const arrowX1 = xEnd - arrowSize * Math.cos(radians - arrowAngle);
    const arrowY1 = yEnd + arrowSize * Math.sin(radians - arrowAngle);
    
    const arrowX2 = xEnd - arrowSize * Math.cos(radians + arrowAngle);
    const arrowY2 = yEnd + arrowSize * Math.sin(radians + arrowAngle);
    
    this.line.beginFill(0xFF0000);
    this.line.drawPolygon([
      xEnd, yEnd,
      arrowX1, arrowY1,
      arrowX2, arrowY2
    ]);
    this.line.endFill();
  }
  
  /**
   * Resize the angle indicator
   * @param width - New screen width
   * @param height - New screen height
   */
  public resize(width: number, height: number): void {
    // Position the angle indicator at the bottom left of the screen
    this.container.position.set(
      100,
      height - 100
    );
  }
} 