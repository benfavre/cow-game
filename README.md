# Cow Launch Game

A physics-based side-scrolling adventure game where you launch a cow across various terrains, perform tricks, and collect power-ups.

## Game Overview

In Cow Launch Game, players control a cow that can be launched across various terrains using physics-based mechanics. The goal is to achieve maximum distance while performing tricks and collecting power-ups.

### Key Features

- Physics-based launch and flight mechanics
- Multiple terrains with unique characteristics
- Power-ups and special abilities
- Trick system with combo multipliers
- Weather effects that impact gameplay
- Leaderboards and achievements

## Technical Stack

- **PixiJS**: Rendering engine
- **Matter.js**: Physics engine
- **React**: UI components
- **TypeScript**: Programming language

## Development Status

This game is currently in development. See [STATUS.md](./STATUS.md) for the current development status and progress.

- **Project Structure**: Completed ✅
- **Core Systems**: In Progress 🔄
- **Basic Gameplay**: In Progress 🔄
- **UI and Menus**: Partially Started 🔄
- **Visual Polish**: Not Started ⏳
- **Testing & Optimization**: Not Started ⏳

### Current Focus

We're currently implementing the core gameplay mechanics, including the launch system, physics interactions, and basic UI components.

## Project Structure

```
cow-launch-game/
├── src/
│   ├── assets/       # Game assets (sprites, sounds, etc.)
│   ├── components/   # React components
│   ├── core/         # Core game systems
│   ├── game/         # Game-specific code
│   │   ├── entities/ # Game entities (cow, obstacles, etc.)
│   │   ├── scenes/   # Game scenes (menu, gameplay, etc.)
│   │   ├── systems/  # Game systems (physics, scoring, etc.)
│   │   └── ui/       # Game UI components
│   ├── utils/        # Utility functions
│   └── index.ts      # Entry point
├── public/           # Static files
├── tsconfig.json     # TypeScript configuration
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## Development Setup

### Prerequisites

- Node.js (v14+)
- npm or bun

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cow-launch-game.git
   cd cow-launch-game
   ```

2. Install dependencies
   ```
   bun install
   ```

3. Generate placeholder assets (for development)
   ```
   node scripts/generate-placeholders.js
   ```

4. Start the development server
   ```
   bun run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Game Controls

- **Space Bar**: Charge and launch the cow (hold to increase power, release to launch)
- **Arrow Up/Down**: Adjust launch angle
- **Arrow Keys (during flight)**: Perform tricks for extra points
- **R**: Restart the game

## Development Workflow

1. Check the current status in `STATUS.md`
2. Work on your assigned tasks
3. Update the status file when completing tasks
4. Submit pull requests for review

## Contributing

See the [DEV-PLAN.md](./DEV-PLAN.md) file for the development roadmap and guidelines.

## License

[MIT License](./LICENSE) 