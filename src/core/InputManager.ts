import * as PIXI from 'pixi.js';

/**
 * Input manager to handle keyboard and touch input
 */
export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private touchActive: boolean = false;
  private touchPosition: { x: number, y: number } = { x: 0, y: 0 };
  private touchStart: { x: number, y: number } = { x: 0, y: 0 };
  private app: PIXI.Application | null = null;
  
  /**
   * Set up input event listeners
   * @param app - PIXI Application instance
   */
  public setup(app: PIXI.Application): void {
    this.app = app;
    
    // Set up keyboard event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    // Set up touch/mouse event listeners
    if (app.view) {
      app.view.addEventListener('pointerdown', this.handlePointerDown);
      app.view.addEventListener('pointermove', this.handlePointerMove);
      app.view.addEventListener('pointerup', this.handlePointerUp);
    }
  }
  
  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    // Remove keyboard event listeners
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    
    // Remove touch/mouse event listeners
    if (this.app && this.app.view) {
      this.app.view.removeEventListener('pointerdown', this.handlePointerDown);
      this.app.view.removeEventListener('pointermove', this.handlePointerMove);
      this.app.view.removeEventListener('pointerup', this.handlePointerUp);
    }
    
    this.app = null;
  }
  
  /**
   * Check if a key is pressed
   * @param key - The key to check
   * @returns Whether the key is pressed
   */
  public isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }
  
  /**
   * Check if touch/mouse is active
   * @returns Whether touch is active
   */
  public isTouchActive(): boolean {
    return this.touchActive;
  }
  
  /**
   * Get touch position
   * @returns Touch position coordinates
   */
  public getTouchPosition(): { x: number, y: number } {
    return this.touchPosition;
  }
  
  /**
   * Get touch drag vector (from start to current position)
   * @returns Touch drag vector
   */
  public getTouchDragVector(): { x: number, y: number } {
    return {
      x: this.touchPosition.x - this.touchStart.x,
      y: this.touchPosition.y - this.touchStart.y
    };
  }
  
  /**
   * Handle key down event
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    this.keys.set(event.key.toLowerCase(), true);
  };
  
  /**
   * Handle key up event
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.set(event.key.toLowerCase(), false);
  };
  
  /**
   * Handle pointer down event
   */
  private handlePointerDown = (event: PointerEvent): void => {
    this.touchActive = true;
    this.touchPosition = { x: event.clientX, y: event.clientY };
    this.touchStart = { x: event.clientX, y: event.clientY };
  };
  
  /**
   * Handle pointer move event
   */
  private handlePointerMove = (event: PointerEvent): void => {
    if (this.touchActive) {
      this.touchPosition = { x: event.clientX, y: event.clientY };
    }
  };
  
  /**
   * Handle pointer up event
   */
  private handlePointerUp = (event: PointerEvent): void => {
    this.touchActive = false;
    this.touchPosition = { x: event.clientX, y: event.clientY };
  };
} 