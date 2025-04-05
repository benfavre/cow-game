/**
 * Manages the game scoring system
 */
export class ScoreManager {
  // Score components
  private distance: number = 0;
  private tricks: number = 0;
  private combos: number = 0;
  private bounces: number = 0;
  private obstacles: number = 0;
  
  // Score multipliers
  private distanceMultiplier: number = 1;
  private trickMultiplier: number = 10;
  private comboMultiplier: number = 5;
  private bounceMultiplier: number = 20;
  private obstacleMultiplier: number = 15;
  
  // Total score
  private totalScore: number = 0;
  
  /**
   * Create a new score manager
   */
  constructor() {
    this.resetScore();
  }
  
  /**
   * Reset the score
   */
  public resetScore(): void {
    this.distance = 0;
    this.tricks = 0;
    this.combos = 0;
    this.bounces = 0;
    this.obstacles = 0;
    this.totalScore = 0;
  }
  
  /**
   * Set the distance traveled
   * @param distance - Distance in pixels
   */
  public setDistance(distance: number): void {
    this.distance = distance;
    this.calculateTotalScore();
  }
  
  /**
   * Add a trick to the score
   * @param value - The value of the trick
   */
  public addTrick(value: number = 1): void {
    this.tricks += value;
    this.calculateTotalScore();
  }
  
  /**
   * Add a combo to the score
   * @param value - The value of the combo
   */
  public addCombo(value: number = 1): void {
    this.combos += value;
    this.calculateTotalScore();
  }
  
  /**
   * Add a bounce to the score
   * @param value - The value of the bounce
   */
  public addBounce(value: number = 1): void {
    this.bounces += value;
    this.calculateTotalScore();
  }
  
  /**
   * Add an obstacle to the score
   * @param value - The value of the obstacle
   */
  public addObstacle(value: number = 1): void {
    this.obstacles += value;
    this.calculateTotalScore();
  }
  
  /**
   * Calculate the total score based on components
   */
  private calculateTotalScore(): void {
    // Base score is distance
    const distanceScore = Math.floor(this.distance / 10) * this.distanceMultiplier;
    
    // Add scores from other components
    const trickScore = this.tricks * this.trickMultiplier;
    const comboScore = this.combos * this.comboMultiplier;
    const bounceScore = this.bounces * this.bounceMultiplier;
    const obstacleScore = this.obstacles * this.obstacleMultiplier;
    
    // Calculate total score
    this.totalScore = 
      distanceScore + 
      trickScore + 
      comboScore + 
      bounceScore + 
      obstacleScore;
  }
  
  /**
   * Get the total score
   * @returns The total score
   */
  public getTotalScore(): number {
    return this.totalScore;
  }
  
  /**
   * Get the distance traveled
   * @returns The distance in pixels
   */
  public getDistance(): number {
    return this.distance;
  }
  
  /**
   * Get the number of tricks performed
   * @returns The number of tricks
   */
  public getTricks(): number {
    return this.tricks;
  }
  
  /**
   * Get the number of combos performed
   * @returns The number of combos
   */
  public getCombos(): number {
    return this.combos;
  }
  
  /**
   * Get the number of bounces performed
   * @returns The number of bounces
   */
  public getBounces(): number {
    return this.bounces;
  }
  
  /**
   * Get the number of obstacles hit
   * @returns The number of obstacles
   */
  public getObstacles(): number {
    return this.obstacles;
  }
  
  /**
   * Get the score breakdown
   * @returns Object with score components
   */
  public getScoreBreakdown(): ScoreBreakdown {
    return {
      distance: {
        value: this.distance,
        score: Math.floor(this.distance / 10) * this.distanceMultiplier
      },
      tricks: {
        value: this.tricks,
        score: this.tricks * this.trickMultiplier
      },
      combos: {
        value: this.combos,
        score: this.combos * this.comboMultiplier
      },
      bounces: {
        value: this.bounces,
        score: this.bounces * this.bounceMultiplier
      },
      obstacles: {
        value: this.obstacles,
        score: this.obstacles * this.obstacleMultiplier
      },
      total: this.totalScore
    };
  }
}

/**
 * Score component interface
 */
interface ScoreComponent {
  value: number;
  score: number;
}

/**
 * Score breakdown interface
 */
interface ScoreBreakdown {
  distance: ScoreComponent;
  tricks: ScoreComponent;
  combos: ScoreComponent;
  bounces: ScoreComponent;
  obstacles: ScoreComponent;
  total: number;
} 