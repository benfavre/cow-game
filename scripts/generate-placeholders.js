#!/usr/bin/env node

/**
 * Script to generate placeholder assets for development
 * Note: This script requires the 'canvas' package to be installed.
 * You can install it with: bun add canvas
 */

const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = [
  'public/assets/sprites',
  'public/assets/spritesheets',
  'public/assets/sounds',
  'public/fonts'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

/**
 * Generate a placeholder sprite (using simple SVG for now)
 */
function generateSprite(name, width, height, color) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${color}" />
    <rect width="${width}" height="${height}" fill="none" stroke="black" stroke-width="2" />
    <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle">${name}</text>
  </svg>`;
  
  const filePath = path.join('public/assets/sprites', `${name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated sprite: ${filePath}`);
}

/**
 * Generate a placeholder icon
 */
function generateIcon() {
  const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#F5F5DC" />
    <circle cx="12" cy="14" r="4" fill="black" />
    <circle cx="20" cy="18" r="3" fill="black" />
    <path d="M8,10 Q16,5 24,10" fill="none" stroke="black" stroke-width="2" />
  </svg>`;
  
  const filePath = path.join('public', 'cow-icon.svg');
  fs.writeFileSync(filePath, svg);
  console.log(`Generated icon: ${filePath}`);
}

/**
 * Generate a placeholder spritesheet
 */
function generateSpritesheet(name, frames = 4) {
  // Create a JSON file for the spritesheet
  const jsonData = {
    frames: {},
    meta: {
      image: `assets/spritesheets/${name}.png`,
      format: "RGBA8888",
      size: { w: 256, h: 64 },
      scale: "1"
    },
    animations: {
      anim: []
    }
  };

  // Define frames
  for (let i = 0; i < frames; i++) {
    const frameName = `${name}${i+1}`;
    jsonData.frames[frameName] = {
      frame: { x: i * 64, y: 0, w: 64, h: 64 },
      sourceSize: { w: 64, h: 64 },
      spriteSourceSize: { x: 0, y: 0, w: 64, h: 64 }
    };
    jsonData.animations.anim.push(frameName);
  }

  // Create an SVG that mimics a spritesheet
  let svg = `<svg width="${64*frames}" height="64" xmlns="http://www.w3.org/2000/svg">`;
  
  for (let i = 0; i < frames; i++) {
    const x = i * 64;
    // Different hue for each frame
    const hue = (i * 360 / frames);
    svg += `
      <rect x="${x}" width="64" height="64" fill="hsl(${hue}, 80%, 60%)" />
      <rect x="${x}" width="64" height="64" fill="none" stroke="black" />
      <text x="${x + 32}" y="32" font-family="Arial" font-size="12" text-anchor="middle" dominant-baseline="middle">Frame ${i+1}</text>
    `;
  }
  
  svg += `</svg>`;
  
  // Save the files
  const jsonFilePath = path.join('public/assets/spritesheets', `${name}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
  
  const svgFilePath = path.join('public/assets/spritesheets', `${name}.svg`);
  fs.writeFileSync(svgFilePath, svg);
  
  console.log(`Generated spritesheet: ${jsonFilePath} and ${svgFilePath}`);
  console.log(`Note: You'll need to convert the SVG to PNG for use with PixiJS.`);
}

// Generate sprites
const sprites = [
  { name: 'cow', width: 64, height: 64, color: '#F5F5DC' },
  { name: 'trampoline', width: 60, height: 20, color: '#FF0000' },
  { name: 'ground', width: 100, height: 50, color: '#8B4513' },
  { name: 'sky', width: 100, height: 100, color: '#87CEEB' },
  { name: 'cloud', width: 80, height: 40, color: '#FFFFFF' },
  { name: 'rock', width: 40, height: 30, color: '#808080' },
  { name: 'tree', width: 60, height: 100, color: '#228B22' },
  { name: 'barn', width: 100, height: 80, color: '#8B0000' }
];

sprites.forEach(sprite => {
  generateSprite(sprite.name, sprite.width, sprite.height, sprite.color);
});

// Generate spritesheets
generateSpritesheet('cow-animations', 4);
generateSpritesheet('effects', 6);

// Generate icon
generateIcon();

// Generate placeholder sound files
const sounds = ['moo', 'bounce', 'wind', 'impact'];
sounds.forEach(sound => {
  const filePath = path.join('public/assets/sounds', `${sound}.mp3`);
  // Create an empty file (you would replace these with actual sound files)
  fs.writeFileSync(filePath, Buffer.from([0]));
  console.log(`Created placeholder sound: ${filePath}`);
});

// Create placeholder font files with valid minimal structure
// A minimal valid TTF file structure (this is not a real font, just enough bytes to avoid parsing errors)
// Based on minimal TTF structure requirements
const minimalFontData = Buffer.from([
  0x00, 0x01, 0x00, 0x00, // Version 1.0
  0x00, 0x04, // Table count (4)
  0x00, 0x10, 0x00, 0x7F, 0x3E, 0x8C, // Search range, entry selector, range shift
  // 'head' table
  0x68, 0x65, 0x61, 0x64, // 'head' tag
  0x00, 0x00, 0x00, 0x01, // checksum
  0x00, 0x00, 0x00, 0x36, // offset
  0x00, 0x00, 0x00, 0x24, // length
  // 'hhea' table
  0x68, 0x68, 0x65, 0x61, // 'hhea' tag
  0x00, 0x00, 0x00, 0x02, // checksum
  0x00, 0x00, 0x00, 0x5A, // offset
  0x00, 0x00, 0x00, 0x24, // length
  // 'maxp' table
  0x6D, 0x61, 0x78, 0x70, // 'maxp' tag
  0x00, 0x00, 0x00, 0x03, // checksum
  0x00, 0x00, 0x00, 0x7E, // offset
  0x00, 0x00, 0x00, 0x20, // length
  // 'name' table
  0x6E, 0x61, 0x6D, 0x65, // 'name' tag
  0x00, 0x00, 0x00, 0x04, // checksum
  0x00, 0x00, 0x00, 0x9E, // offset
  0x00, 0x00, 0x00, 0x30, // length
]);

const fonts = [
  { name: 'LuckiestGuy-Regular.ttf', type: 'truetype' },
  { name: 'Nunito-Regular.ttf', type: 'truetype' },
  { name: 'Bangers-Regular.ttf', type: 'truetype' }
];

fonts.forEach(font => {
  const filePath = path.join('public/fonts', font.name);
  // Create a dummy font file that's at least 4 bytes
  fs.writeFileSync(filePath, minimalFontData);
  console.log(`Created placeholder font: ${filePath} (${minimalFontData.length} bytes)`);
});

console.log('Placeholder assets generated successfully!');
console.log('WARNING: These are just placeholders. You\'ll need to replace them with real assets before production use.'); 