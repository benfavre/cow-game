# Cow Game Asset Generation Guide

This document provides guidelines for generating consistent assets for our cow-launch game using the design profile specified in `prompt.json`.

## How to Use This Guide

When generating assets using an LLM or image generation tool, combine elements from the design profile to create specific prompts. Here's how to structure your requests:

### Basic Prompt Structure

```
[Asset Type] in [Style] with [Color Palette] showing [Specific Details]
```

### Example Prompts

1. **Main Cow Character:**
   ```
   A cartoon cow character with big goofy eyes and flappy tongue, in 2D cartoon style with bold outlines. 
   Primary colors: sky blue, pasture green, and sunny yellow. 
   The cow should look whimsical and humorous, with expressive features.
   ```

2. **Environment Background:**
   ```
   A rolling green hill landscape with barns and fences, in 2D cartoon style. 
   Include dynamic sky layers with clouds and sun. 
   Use the primary color palette of sky blue, pasture green, and sunny yellow.
   ```

3. **UI Elements:**
   ```
   A power meter HUD element in sketchbook style, featuring a bright meter bar with a cow face indicator. 
   Use bubble-letter numbers for the score tracker. 
   Maintain the whimsical, light-hearted tone of the game.
   ```

## Key Design Principles

1. **Style Consistency:**
   - Always maintain the 2D cartoon style with bold outlines
   - Keep shapes simple but expressive
   - Maintain the whimsical, humorous tone

2. **Color Usage:**
   - Primary colors should dominate the main elements
   - Use accent colors for highlights and details
   - Weather variations should use the specified overlays

3. **Character Design:**
   - Main cow should always have the specified features
   - Background characters should be simple but recognizable
   - All characters should maintain the expressive, cartoonish style

4. **Environment Design:**
   - Landscapes should be rolling and dynamic
   - Weather effects should be subtle but noticeable
   - Maintain consistent use of the specified elements

## Asset Types and Specifications

### Character Assets
- Main cow in various poses and expressions
- Background characters (birds, squirrels, sheep)
- Power-up accessories (wings, capes, helmets)

### Environment Assets
- Landscape elements (hills, barns, fences)
- Sky elements (clouds, sun, stars)
- Weather effects (rain, snow, thunder)

### UI Assets
- HUD elements (power meter, angle indicator)
- Menu elements (buttons, icons)
- Score and power-up displays

## Quality Guidelines

1. **Resolution:**
   - All assets should be created in high resolution
   - Maintain consistent proportions across all elements

2. **File Formats:**
   - Use PNG for transparent assets
   - Use JPG for background elements
   - Provide both high and low resolution versions

3. **Animation Guidelines:**
   - Keep animations smooth and fluid
   - Maintain consistent timing across similar elements
   - Ensure all animations loop seamlessly

## Implementation Notes

When implementing these assets:
1. Ensure all assets follow the color palette
2. Maintain consistent line weights and styles
3. Keep the whimsical, humorous tone throughout
4. Test assets in the game environment for consistency

Remember to reference the `prompt.json` file for specific details and combinations when generating new assets.
